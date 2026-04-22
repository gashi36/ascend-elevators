// File: decisionSync.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, fromEvent, from, EMPTY, timer, Subscription } from 'rxjs';
import { takeUntil, concatMap, tap, catchError, filter, take, timeout } from 'rxjs/operators';
import { DecisionStatus, SetMonthlyStatusGQL } from '../../graphql/generated/graphql';

// ─── Config ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'ascend_pending_decisions';
const STORAGE_FAILED_KEY = 'ascend_failed_decisions';
const DEVICE_ID_KEY = 'ascend_device_id';
const DEBUG = true; // Set to false in production

/**
 * Retry budget per queued decision:
 *
 *   Window 0 (first hour) : attempts 1–5, spaced 12 min apart
 *   Window 1 (second hour): attempts 6–10, starts 1 hour after window 0 is exhausted
 *   Window 2 (third hour) : attempts 11–15, starts 1 hour after window 1 is exhausted
 *   After attempt 15      : decision is evicted to failed storage permanently
 *
 * If the device comes back online at any point, ALL pending decisions are
 * retried immediately regardless of their scheduled nextAttemptAt.
 */
const ATTEMPTS_PER_WINDOW = 5;
const MAX_WINDOWS = 3;
const WITHIN_WINDOW_SPACING_MS = 12 * 60 * 1_000;    // 12 min between attempts
const WINDOW_DURATION_MS = 60 * 60 * 1_000;          // 1 hour between windows
const POLL_INTERVAL_MS = 60 * 1_000;                 // check the queue every minute
const SYNC_TIMEOUT_MS = 30_000;                      // 30 second timeout per mutation
const MAX_RETRY_ATTEMPTS = MAX_WINDOWS * ATTEMPTS_PER_WINDOW; // 15

const DEVICE_ID = (() => {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
})();

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DecisionNote {
  __typename?: 'DecisionNote';
  id: string;
  content: string;
  createdBy: string;
  createdByUserId: string;
  createdAt: string;
}

export interface MonthDecision {
  __typename?: 'MonthlyDecision';
  id: string;
  year: number;
  month: number;
  status: DecisionStatus;
  notes: DecisionNote[];
  updatedAt: string;
}

export interface PendingDecision {
  readonly id: string;
  readonly tenantId: string;
  readonly year: number;
  readonly month: number;
  readonly status: DecisionStatus;
  readonly note: string | null;
  readonly clientTimestamp: string;
  readonly totalAttempts: number;
  readonly nextAttemptAt: number;  // epoch ms; 0 = try immediately
  readonly lastAttemptAt: number;  // epoch ms; 0 = never attempted
}

export interface FailedDecision extends PendingDecision {
  readonly failedAt: string;
  readonly reason: string;
}

type DecisionInput = Omit<PendingDecision,
  'id' | 'clientTimestamp' | 'totalAttempts' | 'nextAttemptAt' | 'lastAttemptAt'
>;

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class DecisionSyncService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly inFlight = new Set<string>();
  private readonly syncTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
  private debugMode = DEBUG;

  /** Emits the full queue state after every write. */
  readonly queueChanged$ = new Subject<PendingDecision[]>();

  /** Emits when sync operations complete */
  readonly syncCompleted$ = new Subject<void>();

  get isOnline(): boolean {
    return navigator.onLine;
  }

  get pendingCount(): number {
    return this.readQueue().length;
  }

  get failedCount(): number {
    return this.readFailed().length;
  }

  constructor(private readonly setMonthlyStatusGQL: SetMonthlyStatusGQL) {
    this.log('info', 'DecisionSyncService initialized', { deviceId: DEVICE_ID });
    this.setupEventListeners();
    this.setupCrossTabSync();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearAllTimeouts();
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Save a single decision
   */
  save(input: DecisionInput): void {
    this.log('info', 'Saving single decision', input);
    this.enqueue(this.createPendingDecision(input));
    this.triggerSync({ force: true });
  }

  /**
   * Save multiple decisions
   */
  saveMany(inputs: DecisionInput[]): void {
    if (!inputs.length) return;

    this.log('info', `Saving ${inputs.length} decisions`);

    for (const input of inputs) {
      if (!this.isValidGuid(input.tenantId)) {
        this.log('error', 'Invalid tenant ID', input);
        continue;
      }
      this.enqueue(this.createPendingDecision(input));
    }

    this.triggerSync({ force: true });
  }

  /**
   * Apply pending decisions to tenant's decision list (optimistic update)
   */
  applyPendingToTenant(tenantId: string, decisions: MonthDecision[]): MonthDecision[] {
    const pending = this.readQueue().filter(d => d.tenantId === tenantId);
    if (!pending.length) return decisions;

    const map = new Map(decisions.map(d => [`${d.year}-${d.month}`, { ...d }]));

    for (const p of pending) {
      const key = `${p.year}-${p.month}`;
      const existing = map.get(key);

      // Create optimistic note if there's a pending note
      const optimisticNotes: DecisionNote[] = [...(existing?.notes ?? [])];
      if (p.note) {
        optimisticNotes.push({
          __typename: 'DecisionNote',
          id: `optimistic-${p.id}`,
          content: p.note,
          createdBy: 'You (pending sync)',
          createdByUserId: 'current-user',
          createdAt: p.clientTimestamp,
        });
      }

      map.set(key, {
        __typename: 'MonthlyDecision',
        id: existing?.id ?? `optimistic-${p.id}`,
        year: p.year,
        month: p.month,
        status: p.status,
        notes: optimisticNotes,
        updatedAt: p.clientTimestamp,
      });
    }

    return Array.from(map.values());
  }

  /**
   * Get pending decision for specific tenant/month
   */
  getPendingDecision(tenantId: string, year: number, month: number): PendingDecision | undefined {
    return this.readQueue().find(d =>
      d.tenantId === tenantId && d.year === year && d.month === month
    );
  }

  /**
   * Get all failed decisions
   */
  getFailedDecisions(): FailedDecision[] {
    return this.readFailed();
  }

  /**
   * Retry all failed decisions
   */
  retryFailedDecisions(): void {
    const failed = this.readFailed();
    if (!failed.length) {
      this.log('info', 'No failed decisions to retry');
      return;
    }

    this.log('info', `Retrying ${failed.length} failed decisions`);
    const queue = this.readQueue();

    const toRetry = failed.map(f => ({
      ...f,
      totalAttempts: 0,
      nextAttemptAt: 0,
      lastAttemptAt: 0,
    }));

    this.writeQueue([...queue, ...toRetry]);
    this.clearFailed();

    this.triggerSync({ force: true });
  }

  /**
   * Wait for all pending syncs to complete
   */
  waitForSync(timeoutMs: number = 10000): Promise<void> {
    return new Promise((resolve) => {
      if (this.pendingCount === 0) {
        resolve();
        return;
      }

      const subscription = this.queueChanged$.pipe(
        filter(queue => queue.length === 0),
        take(1),
        timeout({ first: timeoutMs, with: () => EMPTY })
      ).subscribe({
        next: () => {
          subscription.unsubscribe();
          resolve();
        },
        error: () => {
          subscription.unsubscribe();
          resolve();
        }
      });
    });
  }

  /**
   * Clear all queues
   */
  clearAll(): void {
    this.clearQueue();
    this.clearFailed();
    this.log('info', 'All queues cleared');
  }

  clearQueue(): void {
    this.writeQueue([]);
  }

  clearFailed(): void {
    localStorage.removeItem(STORAGE_FAILED_KEY);
  }

  // ─── Private: Initialization ───────────────────────────────────────────────

  private setupEventListeners(): void {
    // Connectivity restored → immediately force-sync everything
    fromEvent(window, 'online')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.log('info', 'Online detected, forcing sync');
        this.triggerSync({ force: true });
      });

    // Tab regains focus → respect the retry schedule
    fromEvent(window, 'focus')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.log('info', 'Window focused, checking queue');
        this.triggerSync({ force: false });
      });

    // Heartbeat: check queue periodically
    timer(0, POLL_INTERVAL_MS)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.isOnline) {
          this.triggerSync({ force: false });
        }
      });
  }

  private setupCrossTabSync(): void {
    try {
      const channel = new BroadcastChannel('decision-sync');

      channel.onmessage = (event) => {
        if (event.data?.type === 'QUEUE_UPDATED') {
          const currentQueue = this.readQueue();
          this.queueChanged$.next(currentQueue);
        }
      };

      // Clean up on destroy
      this.destroy$.subscribe(() => channel.close());
    } catch (error) {
      this.log('warn', 'BroadcastChannel not supported, cross-tab sync disabled');
    }
  }

  // ─── Private: Sync Core ────────────────────────────────────────────────────

  private triggerSync({ force }: { force: boolean }): void {
    if (!this.isOnline) {
      this.log('info', 'Offline, sync delayed');
      return;
    }

    const now = Date.now();
    const queue = this.readQueue().filter(d =>
      force || d.nextAttemptAt <= now
    );

    if (!queue.length) return;

    this.log('info', `Processing ${queue.length} queued decisions`, { force });

    from(queue)
      .pipe(
        concatMap(d => this.syncDecision(d)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        complete: () => {
          this.syncCompleted$.next();
          this.log('info', 'Sync batch completed');
        }
      });
  }

  private syncDecision(decision: PendingDecision) {
    if (this.inFlight.has(decision.id)) {
      this.log('warn', 'Decision already in flight', { id: decision.id });
      return EMPTY;
    }

    this.inFlight.add(decision.id);
    this.log('info', 'Syncing decision', {
      id: decision.id,
      tenantId: decision.tenantId,
      year: decision.year,
      month: decision.month,
      status: decision.status
    });

    // Set timeout to prevent stuck mutations
    const timeoutId = setTimeout(() => {
      if (this.inFlight.has(decision.id)) {
        this.log('warn', 'Sync timeout', { id: decision.id });
        this.inFlight.delete(decision.id);
        this.handleSyncError(decision.id, new Error('Sync timeout'));
      }
    }, SYNC_TIMEOUT_MS);

    this.syncTimeouts.set(decision.id, timeoutId);

    return this.setMonthlyStatusGQL.mutate({
      variables: {
        tenantId: decision.tenantId,
        year: decision.year,
        month: decision.month,
        status: decision.status,
        note: decision.note ?? null,
        deviceId: DEVICE_ID,
        clientTimestamp: decision.clientTimestamp,
      },
    }).pipe(
      tap((response) => {
        this.clearTimeout(decision.id);
        this.dequeue(decision.id);
        this.inFlight.delete(decision.id);
        this.log('info', 'Decision synced successfully', {
          id: decision.id,
          response: response.data?.setMonthlyStatus?.id
        });
      }),
      // In decisionSync.service.ts - syncDecision method
      catchError((err: unknown) => {
        this.clearTimeout(decision.id);
        this.inFlight.delete(decision.id);

        // 🔍 DETAILED ERROR LOGGING
        console.error('=== FULL ERROR DETAILS ===');
        console.error('Error object:', err);

        const graphqlError = err as {
          graphQLErrors?: Array<{
            message: string;
            extensions?: {
              code?: string;
              validationErrors?: any[];
              stackTrace?: string;
            };
            path?: string[];
            locations?: Array<{ line: number; column: number }>;
          }>;
          networkError?: {
            status?: number;
            statusText?: string;
            response?: any;
            message?: string;
          };
          message?: string;
        };

        if (graphqlError.graphQLErrors?.length) {
          console.error('📋 GraphQL Errors:');
          graphqlError.graphQLErrors.forEach((error, index) => {
            console.error(`  Error ${index + 1}:`, {
              message: error.message,
              path: error.path,
              locations: error.locations,
              extensions: error.extensions
            });
          });
        }

        if (graphqlError.networkError) {
          console.error('🌐 Network Error:', {
            status: graphqlError.networkError.status,
            statusText: graphqlError.networkError.statusText,
            message: graphqlError.networkError.message,
            response: graphqlError.networkError.response
          });
        }

        console.error('Error message:', this.extractErrorMessage(err));
        console.error('=== END ERROR DETAILS ===');

        this.log('error', 'Sync failed', {
          id: decision.id,
          error: this.extractErrorMessage(err)
        });

        this.handleSyncError(decision.id, err);
        return EMPTY;
      })
    );
  }

  private handleSyncError(id: string, err: unknown): void {
    if (this.isRetryable(err)) {
      this.log('warn', 'Retryable error, scheduling retry', { id });
      this.scheduleRetry(id);
    } else {
      this.log('error', 'Non-retryable error, evicting to failed', { id });
      const d = this.readQueue().find(q => q.id === id);
      if (d) {
        this.evictToFailed(d, this.extractErrorMessage(err));
        this.dequeue(id);
      }
    }
  }

  private isRetryable(err: unknown): boolean {
    const e = err as {
      networkError?: unknown;
      graphQLErrors?: { extensions?: { code?: string } }[];
      status?: number;
    };

    // Network errors are retryable
    if (e?.networkError) return true;

    // Timeout errors are retryable
    if (err instanceof Error && err.message === 'Sync timeout') return true;

    // HTTP 5xx errors are retryable
    if (e?.status && e.status >= 500 && e.status < 600) return true;

    // GraphQL server errors are retryable
    if (e?.graphQLErrors?.[0]?.extensions?.code === 'SERVER_ERROR') return true;

    // Auth/validation/schema errors won't fix themselves
    return false;
  }

  // ─── Private: Retry Scheduling ─────────────────────────────────────────────

  private scheduleRetry(id: string): void {
    const now = Date.now();
    const queue = this.readQueue();
    const idx = queue.findIndex(d => d.id === id);

    if (idx === -1) return;

    const d = queue[idx];
    const totalAttempts = d.totalAttempts + 1;

    if (totalAttempts >= MAX_RETRY_ATTEMPTS) {
      this.log('warn', 'Max retry attempts reached, evicting', {
        id,
        attempts: totalAttempts
      });
      this.evictToFailed(
        d,
        `Sync failed after ${MAX_RETRY_ATTEMPTS} attempts across ${MAX_WINDOWS} hour windows`
      );
      queue.splice(idx, 1);
      this.writeQueue(queue);
      return;
    }

    const posInWindow = totalAttempts % ATTEMPTS_PER_WINDOW;
    const nextAttemptAt = posInWindow === 0
      ? now + WINDOW_DURATION_MS
      : now + WITHIN_WINDOW_SPACING_MS;

    queue[idx] = { ...d, totalAttempts, nextAttemptAt, lastAttemptAt: now };
    this.writeQueue(queue);

    this.log('info', 'Retry scheduled', {
      id,
      attempt: totalAttempts,
      nextAttempt: new Date(nextAttemptAt).toISOString()
    });
  }

  // ─── Private: Queue Management ─────────────────────────────────────────────

  private createPendingDecision(input: DecisionInput): PendingDecision {
    return {
      ...input,
      id: crypto.randomUUID(),
      clientTimestamp: new Date().toISOString(),
      totalAttempts: 0,
      nextAttemptAt: 0,
      lastAttemptAt: 0,
    };
  }

  private enqueue(decision: PendingDecision): void {
    const queue = this.readQueue();
    const idx = queue.findIndex(d =>
      d.tenantId === decision.tenantId &&
      d.year === decision.year &&
      d.month === decision.month
    );

    if (idx >= 0) {
      this.log('info', 'Replacing existing pending decision', {
        oldId: queue[idx].id,
        newId: decision.id
      });
      queue[idx] = decision;
    } else {
      queue.push(decision);
    }

    this.writeQueue(queue);
  }

  private dequeue(id: string): void {
    const newQueue = this.readQueue().filter(d => d.id !== id);
    this.writeQueue(newQueue);

    // Check if queue is empty
    if (newQueue.length === 0) {
      this.syncCompleted$.next();
    }
  }

  private readQueue(): PendingDecision[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch (error) {
      this.log('error', 'Failed to read queue', error);
      return [];
    }
  }

  private writeQueue(queue: PendingDecision[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
      this.queueChanged$.next([...queue]);

      // Broadcast to other tabs
      this.broadcastQueueUpdate();
    } catch (error) {
      this.log('error', 'Failed to write queue', error);
    }
  }

  private broadcastQueueUpdate(): void {
    try {
      const channel = new BroadcastChannel('decision-sync');
      channel.postMessage({ type: 'QUEUE_UPDATED' });
      channel.close();
    } catch (error) {
      // BroadcastChannel not supported
    }
  }

  // ─── Private: Failed Decisions Storage ─────────────────────────────────────

  private evictToFailed(decision: PendingDecision, reason: string): void {
    const failed = this.readFailed();
    const existing = failed.findIndex(f =>
      f.tenantId === decision.tenantId &&
      f.year === decision.year &&
      f.month === decision.month
    );

    const entry: FailedDecision = {
      ...decision,
      failedAt: new Date().toISOString(),
      reason,
    };

    if (existing >= 0) {
      failed[existing] = entry;
    } else {
      failed.push(entry);
    }

    try {
      localStorage.setItem(STORAGE_FAILED_KEY, JSON.stringify(failed));
      this.log('warn', 'Decision evicted to failed storage', {
        id: decision.id,
        reason
      });
    } catch (error) {
      this.log('error', 'Failed to save failed decision', error);
    }
  }

  private readFailed(): FailedDecision[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_FAILED_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  // ─── Private: Utilities ────────────────────────────────────────────────────

  private isValidGuid(str: string): boolean {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return guidRegex.test(str);
  }

  private extractErrorMessage(err: unknown): string {
    const e = err as {
      graphQLErrors?: Array<{ message: string }>;
      message?: string;
      networkError?: { message?: string };
    };

    return e?.graphQLErrors?.[0]?.message ??
      e?.networkError?.message ??
      e?.message ??
      'Unknown error';
  }

  private clearTimeout(id: string): void {
    const timeoutId = this.syncTimeouts.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.syncTimeouts.delete(id);
    }
  }

  private clearAllTimeouts(): void {
    this.syncTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.syncTimeouts.clear();
  }

  private log(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
    if (!this.debugMode && level !== 'error') return;

    const prefix = `[DecisionSync ${new Date().toISOString()}]`;
    const logData = data ? this.sanitizeLogData(data) : undefined;

    switch (level) {
      case 'warn':
        console.warn(prefix, message, logData);
        break;
      case 'error':
        console.error(prefix, message, logData);
        break;
      default:
    }
  }

  private sanitizeLogData(data: any): any {
    if (!data) return data;

    try {
      // Clone to avoid mutation and remove sensitive fields
      const sanitized = JSON.parse(JSON.stringify(data));
      // Remove any potential sensitive fields if needed
      return sanitized;
    } catch {
      return String(data);
    }
  }

  // ─── Public: Debug Methods ─────────────────────────────────────────────────

  /**
   * Enable/disable debug logging
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    this.log('info', `Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get current queue state for debugging
   */
  getDebugState(): {
    queue: PendingDecision[];
    failed: FailedDecision[];
    inFlight: string[];
    isOnline: boolean;
  } {
    return {
      queue: this.readQueue(),
      failed: this.readFailed(),
      inFlight: Array.from(this.inFlight),
      isOnline: this.isOnline,
    };
  }

  /**
   * Force sync all pending decisions (for debugging)
   */
  forceSyncNow(): void {
    this.log('info', 'Manual force sync triggered');
    this.triggerSync({ force: true });
  }
}
