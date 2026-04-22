// tenant-table.component.ts
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../funcServices/auth.service';
import {
  DecisionStatus,
  SortEnumType,
  TenantSortInput,
  TenantFilterInput,
  GetTenantsWithDecisionsGQL,
  GetBuildingsGQL,
  GetBuildingEntriesByBuildingGQL,
  CreateTenantGQL,
  UpdateTenantGQL,
  DeleteTenantGQL,
  GetBuildingEntryByIdGQL,
} from '../../../../graphql/generated/graphql';
import { DecisionSyncService } from '../../../funcServices/decisionSync.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

interface DecisionNote {
  id: string;
  content: string;
  createdBy: string;
  createdByUserId: string;
  createdAt: string;
}

interface MonthDecision {
  id: string;
  year: number;
  month: number;
  status: DecisionStatus;
  notes: DecisionNote[];
  updatedAt: string;
}

interface TenantRow {
  id: string;
  name: string;
  unitNumber: string;
  floor: string | null;
  contactPhone: string;
  contactEmail: string | null;
  accessKeyNR: string;
  buildingEntryId: string;
  buildingId: string;
  buildingName: string;
  entryName: string;
  allDecisions: MonthDecision[];
  displayDecisions: MonthDecision[];
}

interface BuildingOption {
  id: string;
  name: string;
}

interface EntryOption {
  id: string;
  name: string;
  buildingId: string;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface DecisionInput {
  tenantId: string;
  year: number;
  month: number;
  status: DecisionStatus;
  note: string | null;
}

type ModalMode = 'createEdit' | 'decision' | 'delete' | 'notes' | null;

const PAGE_SIZE = 15;

@Component({
  selector: 'app-tenant-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslatePipe],
  templateUrl: './tenant-table.component.html',
})
export class TenantTableComponent implements OnInit, OnDestroy {

  @Input() buildingId?: string;
  @Input() entryId?: string;

  private readonly destroy$ = new Subject<void>();
  private readonly search$ = new Subject<string>();

  readonly DecisionStatus = DecisionStatus;
  readonly months = [
    { value: 1, label: 'Jan' }, { value: 2, label: 'Shk' },
    { value: 3, label: 'Mar' }, { value: 4, label: 'Pri' },
    { value: 5, label: 'Maj' }, { value: 6, label: 'Qer' },
    { value: 7, label: 'Kor' }, { value: 8, label: 'Gush' },
    { value: 9, label: 'Sht' }, { value: 10, label: 'Tet' },
    { value: 11, label: 'Nën' }, { value: 12, label: 'Dhj' },
  ];

  tenants: TenantRow[] = [];
  isLoading = false;
  search = '';
  pageInfo: PageInfo | null = null;
  totalCount = 0;
  private cursorStack: (string | null)[] = [null];
  get currentPage(): number { return this.cursorStack.length; }

  sortField: keyof Pick<TenantSortInput, 'name' | 'floor' | 'unitNumber'> = 'name';
  sortDir: SortEnumType = SortEnumType.Asc;

  buildingOptions: BuildingOption[] = [];
  entryOptions: EntryOption[] = [];
  filteredEntries: EntryOption[] = [];
  loadingOptions = false;
  pendingCount = 0;

  lockedBuildingName = '—';
  lockedEntryName = '—';

  activeModal: ModalMode = null;
  selectedTenant: TenantRow | null = null;
  editingId: string | null = null;
  modalLoading = false;
  modalError: string | null = null;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'warning' = 'success';
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  selectedYear = new Date().getFullYear();
  readonly currentYear = new Date().getFullYear();
  readonly currentMonth = new Date().getMonth() + 1;
  availableYears: number[] = [];

  selectedMonths: Record<number, number[]> = {};
  selectedStatus: DecisionStatus = DecisionStatus.Allowed;
  decisionNoteDraft = '';

  // Notes modal properties
  notesForModal: DecisionNote[] = [];
  notesModalTitle = '';

  confirmModalVisible = false;
  confirmModalData: {
    tenant: TenantRow;
    year: number;
    month: number;
    currentStatus: DecisionStatus;
  } | null = null;

  tenantForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    public readonly authService: AuthService,
    private readonly decisionSync: DecisionSyncService,
    private readonly getTenantsWithDecisionsGQL: GetTenantsWithDecisionsGQL,
    private readonly getBuildingsGQL: GetBuildingsGQL,
    private readonly getBuildingEntryByIdGQL: GetBuildingEntryByIdGQL,
    private readonly getBuildingEntriesByBuildingGQL: GetBuildingEntriesByBuildingGQL,
    private readonly createTenantGQL: CreateTenantGQL,
    private readonly updateTenantGQL: UpdateTenantGQL,
    private readonly deleteTenantGQL: DeleteTenantGQL,

  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.setupYears();
    this.setupSearch();
    this.loadOptions();
    this.loadTenants();

    this.decisionSync.queueChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(q => {
        this.pendingCount = q.length;
        if (q.length === 0) {
          this.refreshData();
        }
      });
    this.pendingCount = this.decisionSync.pendingCount;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.toastTimer) clearTimeout(this.toastTimer);
  }

  refreshData(): void {
    this.cursorStack = [null];
    this.loadTenants();
  }

  loadTenants(after: string | null = null): void {
    this.isLoading = true;
    const where = this.buildWhere();
    const order: TenantSortInput[] = [{ [this.sortField]: this.sortDir } as TenantSortInput];

    const variables: Record<string, unknown> = {
      first: PAGE_SIZE,
      ...(after ? { after } : {}),
      where,
      order,
    };

    this.getTenantsWithDecisionsGQL
      .fetch({ variables })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.error) {
            console.error('GraphQL errors:', res.error);
            this.showToast('Gabim gjatë ngarkimit', 'error');
            return;
          }

          const conn = res.data?.tenants;
          if (!conn?.edges) {
            this.tenants = [];
            this.totalCount = 0;
            return;
          }

          this.tenants = conn.edges.filter((e: any) => !!e?.node).map((e: any) => this.toRow(e.node));
          this.pageInfo = conn?.pageInfo as PageInfo ?? null;
          this.totalCount = conn?.totalCount ?? this.tenants.length;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('GraphQL error:', err);
          this.showToast('Dështoi ngarkimi i qiramarrësve.', 'error');
        },
      });
  }

  private toRow(t: any): TenantRow {
    const allRawDecisions = (t.monthlyDecisions ?? []).map((d: any) => {
      const notes: DecisionNote[] = (d.notes ?? []).map((note: any) => ({
        id: note.id,
        content: note.content,
        createdBy: note.createdBy,
        createdByUserId: note.createdByUserId,
        createdAt: note.createdAt
      }));

      const decision: MonthDecision = {
        id: d.id,
        year: d.year,
        month: d.month,
        status: d.status,
        notes: notes,
        updatedAt: d.updatedAt,
      };

      return decision;
    });

    const allDecisions = this.decisionSync.applyPendingToTenant(t.id, allRawDecisions);

    const minYear = this.currentYear - 1;
    const maxYear = this.currentYear + 1;
    const displayDecisions = allDecisions.filter(d => d.year >= minYear && d.year <= maxYear);

    return {
      id: t.id,
      name: t.name ?? 'N/A',
      unitNumber: t.unitNumber ?? 'N/A',
      floor: t.floor ?? null,
      contactPhone: t.contactPhone ?? 'N/A',
      contactEmail: t.contactEmail ?? null,
      accessKeyNR: t.accessKeyNR ?? 'N/A',
      buildingEntryId: t.buildingEntryId,
      buildingId: t.buildingEntry?.building?.id ?? '',
      buildingName: t.buildingEntry?.building?.name ?? '—',
      entryName: t.buildingEntry?.name ?? '—',
      allDecisions,
      displayDecisions,
    };
  }

  getAllNotesForTenant(tenant: TenantRow): DecisionNote[] {
    const allNotes: DecisionNote[] = [];
    for (const decision of tenant.allDecisions) {
      if (decision.notes && Array.isArray(decision.notes) && decision.notes.length > 0) {
        allNotes.push(...decision.notes);
      }
    }
    return allNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getDecisionStatus(tenant: TenantRow, year: number, month: number): DecisionStatus {
    const decision = tenant.allDecisions.find(d => d.year === year && d.month === month);
    return decision?.status ?? DecisionStatus.Pending;
  }

  hasNotes(tenant: TenantRow, year: number, month: number): boolean {
    const decision = tenant.allDecisions.find(d => d.year === year && d.month === month);
    return (decision?.notes?.length ?? 0) > 0;
  }

  statusForMonth(tenant: TenantRow, month: number): DecisionStatus {
    const decision = tenant.allDecisions.find(d => d.year === this.currentYear && d.month === month);
    return decision?.status ?? DecisionStatus.Pending;
  }

  openNotesModal(tenant: TenantRow, year: number, month: number): void {
    const decision = tenant.allDecisions.find(d => d.year === year && d.month === month);
    if (!decision || !decision.notes || decision.notes.length === 0) {
      this.showToast('Nuk ka shënime për këtë muaj', 'warning');
      return;
    }

    this.selectedTenant = tenant;
    this.notesForModal = decision.notes.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    this.notesModalTitle = `Shënimet për ${this.monthName(month)} ${year} - ${tenant.name}`;
    this.openModal('notes');
  }

  openAllNotesModal(tenant: TenantRow): void {
    const allNotes = this.getAllNotesForTenant(tenant);
    if (allNotes.length === 0) {
      this.showToast('Nuk ka shënime për këtë banor', 'warning');
      return;
    }

    this.selectedTenant = tenant;
    this.notesForModal = allNotes;
    this.notesModalTitle = `Të gjitha shënimet - ${tenant.name}`;
    this.openModal('notes');
  }

  private buildWhere(): TenantFilterInput {
    const conditions: TenantFilterInput[] = [];

    if (this.entryId && this.entryId !== '') {
      conditions.push({ buildingEntryId: { eq: this.entryId } });
    } else if (this.buildingId && this.buildingId !== '') {
      conditions.push({ buildingEntry: { buildingId: { eq: this.buildingId } } });
    }

    if (this.search?.trim()) {
      conditions.push({
        or: [
          { name: { contains: this.search } },
          { unitNumber: { contains: this.search } },
          { accessKeyNR: { contains: this.search } },
          { contactPhone: { contains: this.search } },
        ],
      });
    }

    return conditions.length === 0 ? {} : conditions.length > 1 ? { and: conditions } : conditions[0];
  }

  private loadOptions(): void {
    this.loadingOptions = true;
    this.getBuildingsGQL
      .fetch({ variables: { first: 100, order: [{ name: SortEnumType.Asc }] } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.buildingOptions = (res.data?.buildings?.edges ?? [])
            .filter(e => !!e?.node?.id)
            .map(e => ({ id: e!.node!.id, name: e!.node!.name }));

          if (this.entryId) {
            this.loadLockedEntryInfo();
          } else if (this.buildingId) {
            const building = this.buildingOptions.find(b => b.id === this.buildingId);
            this.lockedBuildingName = building?.name || '—';
            this.loadEntriesForBuilding(this.buildingId);
          }
          this.loadingOptions = false;
        },
        error: () => { this.loadingOptions = false; },
      });
  }

  private loadLockedEntryInfo(): void {
    this.getBuildingEntryByIdGQL
      .fetch({ variables: { id: this.entryId } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const entry = res.data?.buildingEntryById;
          if (entry) {
            this.lockedEntryName = entry.name;
            if (entry.buildingId) {
              const building = this.buildingOptions.find(b => b.id === entry.buildingId);
              this.lockedBuildingName = building?.name || '—';
              this.loadEntriesForBuilding(entry.buildingId);
            }
          }
        },
        error: () => { this.lockedEntryName = '—'; },
      });
  }

  private loadEntriesForBuilding(buildingId: string): void {
    this.getBuildingEntriesByBuildingGQL
      .fetch({ variables: { buildingId, first: 100 } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.entryOptions = (res.data?.buildingEntriesByBuilding?.edges ?? [])
            .filter(e => !!e?.node?.id)
            .map(e => ({ id: e!.node!.id, name: e!.node!.name, buildingId: e!.node!.buildingId }));
          this.filteredEntries = this.entryOptions;
        },
        error: () => { this.showToast('Dështoi ngarkimi i hyrjeve', 'error'); },
      });
  }

  nextPage(): void {
    if (!this.pageInfo?.hasNextPage || !this.pageInfo.endCursor) return;
    this.cursorStack.push(this.pageInfo.endCursor);
    this.loadTenants(this.pageInfo.endCursor);
  }

  prevPage(): void {
    if (this.cursorStack.length <= 1) return;
    this.cursorStack.pop();
    this.loadTenants(this.cursorStack[this.cursorStack.length - 1]);
  }

  private setupSearch(): void {
    this.search$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => { this.refreshData(); });
  }

  onSearch(value: string): void {
    this.search = value;
    this.search$.next(value);
  }

  setSort(field: typeof this.sortField): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === SortEnumType.Asc ? SortEnumType.Desc : SortEnumType.Asc;
    } else {
      this.sortField = field;
      this.sortDir = SortEnumType.Asc;
    }
    this.refreshData();
  }

  openCreate(): void {
    this.editingId = null;
    let defaultBuildingId: string | null = null;
    let defaultEntryId: string | null = null;

    if (this.entryId) {
      defaultEntryId = this.entryId;
      const entry = this.entryOptions.find(e => e.id === this.entryId);
      defaultBuildingId = entry?.buildingId || null;
    } else if (this.buildingId) {
      defaultBuildingId = this.buildingId;
    }

    this.tenantForm.reset({
      name: '', unitNumber: '', floor: '',
      contactPhone: '', contactEmail: '', accessKeyNR: '',
      buildingId: defaultBuildingId,
      buildingEntryId: defaultEntryId,
    });

    if (defaultBuildingId && this.entryOptions.length === 0) {
      this.loadEntriesForBuilding(defaultBuildingId);
    }
    this.openModal('createEdit');
  }

  openEdit(tenant: TenantRow): void {
    this.editingId = tenant.id;
    const entry = this.entryOptions.find(e => e.id === tenant.buildingEntryId);
    this.tenantForm.patchValue({
      name: tenant.name,
      unitNumber: tenant.unitNumber,
      floor: tenant.floor ?? '',
      contactPhone: tenant.contactPhone,
      contactEmail: tenant.contactEmail ?? '',
      accessKeyNR: tenant.accessKeyNR,
      buildingEntryId: tenant.buildingEntryId,
      buildingId: entry?.buildingId || null,
    });
    if (entry?.buildingId) this.loadEntriesForBuilding(entry.buildingId);
    this.openModal('createEdit');
  }

  openDelete(tenant: TenantRow): void {
    this.selectedTenant = tenant;
    this.openModal('delete');
  }

  submitTenant(): void {
    if (this.tenantForm.invalid || this.modalLoading) {
      this.tenantForm.markAllAsTouched();
      return;
    }
    this.modalLoading = true;
    this.modalError = null;
    const v = this.tenantForm.value;

    if (!v.buildingEntryId) {
      this.modalError = 'Ju lutem zgjidhni një hyrje.';
      this.modalLoading = false;
      return;
    }

    if (this.editingId) {
      this.updateTenantGQL.mutate({
        variables: {
          id: this.editingId,
          name: v.name.trim(),
          unitNumber: v.unitNumber.trim(),
          floor: v.floor?.trim() || null,
          contactPhone: v.contactPhone.trim(),
          contactEmail: v.contactEmail?.trim() || null,
          accessKeyNR: v.accessKeyNR.trim(),
          buildingEntryId: v.buildingEntryId,
        },
      }).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.closeModal();
          this.refreshData();
          this.showToast('Banori u përditësua.');
        },
        error: (e) => {
          this.modalLoading = false;
          this.modalError = this.parseError(e);
        },
      });
    } else {
      this.createTenantGQL.mutate({
        variables: {
          name: v.name.trim(),
          unitNumber: v.unitNumber.trim(),
          floor: v.floor?.trim() || null,
          contactPhone: v.contactPhone.trim(),
          contactEmail: v.contactEmail?.trim() || null,
          accessKeyNR: v.accessKeyNR.trim(),
          buildingEntryId: v.buildingEntryId,
        },
      }).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.closeModal();
          this.refreshData();
          this.showToast('Banori u shtua.');
        },
        error: (e) => {
          this.modalLoading = false;
          this.modalError = this.parseError(e);
        },
      });
    }
  }

  submitDelete(): void {
    if (!this.selectedTenant || this.modalLoading) return;
    this.modalLoading = true;
    this.deleteTenantGQL.mutate({ variables: { id: this.selectedTenant.id } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeModal();
          this.refreshData();
          this.showToast('Banori u fshi.');
        },
        error: (e) => {
          this.modalLoading = false;
          this.modalError = this.parseError(e);
        },
      });
  }

  openDecisionModal(tenant: TenantRow): void {
    this.selectedTenant = tenant;
    this.selectedMonths = {};
    this.selectedStatus = DecisionStatus.Allowed;
    this.decisionNoteDraft = '';
    this.availableYears = [this.currentYear - 1, this.currentYear, this.currentYear + 1];
    this.selectedYear = this.currentYear;
    this.openModal('decision');
  }

  toggleMonth(month: number): void {
    if (!this.selectedTenant) {
      return;
    }

    const existing = this.selectedTenant.displayDecisions.find(
      d => d.year === this.selectedYear && d.month === month
    );

    if (!existing) {
      const newDecision: MonthDecision = {
        id: '',
        year: this.selectedYear,
        month: month,
        status: DecisionStatus.Pending,
        notes: [],
        updatedAt: new Date().toISOString()
      };
      this.selectedTenant.displayDecisions.push(newDecision);
      this.selectedTenant.allDecisions.push(newDecision);
      this.toggleMonthSelection(month);
      return;
    }

    if (existing.status !== DecisionStatus.Pending) {
      this.confirmModalData = {
        tenant: this.selectedTenant,
        year: this.selectedYear,
        month,
        currentStatus: existing.status,
      };
      this.confirmModalVisible = true;
      return;
    }

    this.toggleMonthSelection(month);
  }

  private toggleMonthSelection(month: number): void {
    if (!this.selectedMonths[this.selectedYear]) {
      this.selectedMonths[this.selectedYear] = [];
    }
    const list = this.selectedMonths[this.selectedYear];
    const index = list.indexOf(month);
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(month);
    }
    this.selectedMonths = { ...this.selectedMonths };
  }

  overrideExistingDecision(): void {
    if (!this.confirmModalData) return;
    this.toggleMonthSelection(this.confirmModalData.month);
    this.confirmModalVisible = false;
    this.confirmModalData = null;
    this.showToast('Muaji do të ndryshohet', 'warning');
  }

  cancelOverride(): void {
    this.confirmModalVisible = false;
    this.confirmModalData = null;
  }

  selectAll(): void {
    this.selectedMonths[this.selectedYear] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    this.selectedMonths = { ...this.selectedMonths };
  }

  clearAll(): void {
    this.selectedMonths[this.selectedYear] = [];
    this.selectedMonths = { ...this.selectedMonths };
  }

  selectCurrent(): void {
    this.selectedMonths[this.selectedYear] = [this.currentMonth];
    this.selectedMonths = { ...this.selectedMonths };
  }

  isSelected(month: number): boolean {
    return this.selectedMonths[this.selectedYear]?.includes(month) ?? false;
  }

  prevYear(): void {
    if (this.selectedYear > this.currentYear - 1) {
      this.selectedYear--;
      if (!this.selectedMonths[this.selectedYear]) {
        this.selectedMonths[this.selectedYear] = [];
      }
      this.selectedMonths = { ...this.selectedMonths };
    }
  }

  nextYear(): void {
    if (this.selectedYear < this.currentYear + 1) {
      this.selectedYear++;
      if (!this.selectedMonths[this.selectedYear]) {
        this.selectedMonths[this.selectedYear] = [];
      }
      this.selectedMonths = { ...this.selectedMonths };
    }
  }

  get selectedMonthCount(): number {
    return Object.values(this.selectedMonths).flat().length;
  }

  saveDecisions(): void {
    if (!this.selectedTenant) {
      this.showToast('Gabim: Asnjë banor i zgjedhur', 'error');
      return;
    }

    const inputs: DecisionInput[] = [];

    for (const [yearStr, months] of Object.entries(this.selectedMonths)) {
      const year = Number(yearStr);

      if (!months || months.length === 0) continue;

      for (const month of months) {
        inputs.push({
          tenantId: this.selectedTenant.id,
          year,
          month,
          status: this.selectedStatus,
          note: this.decisionNoteDraft?.trim() || null,
        });
      }
    }

    if (inputs.length === 0) {
      this.showToast('Zgjidhni të paktën një muaj.', 'warning');
      return;
    }
    this.decisionSync.saveMany(inputs);
    this.showToast(`${inputs.length} vendim u ruajt në pritje.`, 'success');

    this.closeModal();
    setTimeout(() => {
      this.refreshData();
    }, 500);
  }

  monthButtonClass(status: DecisionStatus): string {
    switch (status) {
      case DecisionStatus.Allowed: return 'bg-green-500 text-white';
      case DecisionStatus.Denied: return 'bg-red-500 text-white';
      default: return 'bg-yellow-500 text-white';
    }
  }

  monthCardClass(month: number): string {
    if (!this.selectedTenant) return '';

    const isSelected = this.isSelected(month);
    const status = this.getDecisionStatus(this.selectedTenant, this.selectedYear, month);
    const hasNote = this.hasNotes(this.selectedTenant, this.selectedYear, month);
    const base = 'flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all select-none relative';

    if (isSelected) {
      return `${base} ${this.selectedStatus === DecisionStatus.Allowed
        ? 'border-green-500 bg-green-500 text-white'
        : 'border-red-500 bg-red-500 text-white'}`;
    }

    let statusClass = '';
    switch (status) {
      case DecisionStatus.Allowed: statusClass = 'border-green-500 bg-green-100 text-green-800 hover:bg-green-200'; break;
      case DecisionStatus.Denied: statusClass = 'border-red-500 bg-red-100 text-red-800 hover:bg-red-200'; break;
      default: statusClass = 'border-yellow-400 bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    }

    if (hasNote) statusClass += ' ring-2 ring-blue-400';

    return `${base} ${statusClass}`;
  }

  statusLabel(status: DecisionStatus): string {
    switch (status) {
      case DecisionStatus.Allowed: return 'Lejuar';
      case DecisionStatus.Denied: return 'Refuzuar';
      default: return 'Në Pritje';
    }
  }

  monthName(m: number): string {
    return ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
      'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'][m - 1] ?? '';
  }

  getMonthTooltip(tenant: TenantRow | null, year: number, month: number): string {
    if (!tenant) return '';
    const decision = tenant.allDecisions.find(d => d.year === year && d.month === month);
    if (!decision || decision.status === DecisionStatus.Pending) return 'Kliko për të ndryshuar statusin';
    const noteCount = decision.notes.length;
    return `Statusi: ${decision.status === DecisionStatus.Allowed ? 'Lejuar' : 'Refuzuar'}\n${noteCount > 0 ? `Shënime: ${noteCount}` : 'Pa shënime'}\nKliko për të ndryshuar`;
  }

  onBuildingChange(event: Event): void {
    const buildingId = (event.target as HTMLSelectElement).value;
    this.tenantForm.patchValue({ buildingEntryId: null });
    this.loadEntriesForBuilding(buildingId);
  }

  isBuildingLocked(): boolean { return !!this.entryId; }
  isEntryLocked(): boolean { return !!this.entryId; }
  getLockedBuildingName(): string { return this.lockedBuildingName; }
  getLockedEntryName(): string { return this.lockedEntryName; }

  private openModal(mode: ModalMode): void {
    this.modalError = null;
    this.modalLoading = false;
    this.activeModal = mode;
  }

  closeModal(): void {
    this.activeModal = null;
    this.selectedTenant = null;
    this.editingId = null;
    this.modalError = null;
    this.modalLoading = false;
    this.selectedMonths = {};
    this.decisionNoteDraft = '';
    this.notesForModal = [];
    this.notesModalTitle = '';
  }

  showToast(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastMessage = message;
    this.toastType = type;
    this.toastTimer = setTimeout(() => { this.toastMessage = null; }, type === 'error' ? 5000 : 3000);
  }

  private setupYears(): void {
    this.availableYears = [this.currentYear - 1, this.currentYear, this.currentYear + 1];
    this.selectedYear = this.currentYear;
  }

  private buildForm(): void {
    this.tenantForm = this.fb.group({
      name: ['', Validators.required],
      unitNumber: ['', Validators.required],
      floor: [''],
      contactPhone: ['', Validators.required],
      contactEmail: ['', Validators.email],
      accessKeyNR: ['', Validators.required],
      buildingId: [null],
      buildingEntryId: [null],
    });
  }

  private parseError(e: unknown): string {
    const err = e as { graphQLErrors?: { message: string }[]; message?: string };
    return err?.graphQLErrors?.[0]?.message ?? err?.message ?? 'Ndodhi një gabim.';
  }
}
