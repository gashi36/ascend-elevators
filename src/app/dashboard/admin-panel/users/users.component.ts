import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  UserRole,
  GetUsersGQL,
  CreateUserGQL,
  UpdateUserGQL,
  DeleteUserGQL,
  BlockClientGQL,
  UnblockClientGQL,
  AdminResetPasswordGQL,
} from '../../../../graphql/generated/graphql';
import { AuthService, AuthUser } from '../../../funcServices/auth.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

// ─── Local UI models ──────────────────────────────────────────────────────────

interface UserRow {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

type ModalMode = 'create' | 'edit' | 'delete' | 'resetPassword' | null;
type ModalTarget = 'admin' | 'manager' | null;

const PAGE_SIZE = 10;

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  readonly UserRole = UserRole;

  // ─── Auth ──────────────────────────────────────────────────────────────────

  currentUser: AuthUser | null = null;

  // ─── Superadmin view ───────────────────────────────────────────────────────

  admins: UserRow[] = [];
  adminSearch = '';
  adminPageInfo: PageInfo | null = null;
  adminTotal = 0;
  private adminCursorStack: (string | null)[] = [null];
  get adminPage(): number { return this.adminCursorStack.length; }

  // ─── Admin view ────────────────────────────────────────────────────────────

  selfRow: UserRow | null = null;
  managers: UserRow[] = [];
  managerSearch = '';
  managerPageInfo: PageInfo | null = null;
  managerTotal = 0;
  private managerCursorStack: (string | null)[] = [null];
  get managerPage(): number { return this.managerCursorStack.length; }

  // ─── Shared ────────────────────────────────────────────────────────────────

  isLoading = false;

  // ─── Modal ─────────────────────────────────────────────────────────────────

  activeModal: ModalMode = null;
  modalTarget: ModalTarget = null;
  selectedUser: UserRow | null = null;
  modalLoading = false;
  modalError: string | null = null;

  // ─── Forms ─────────────────────────────────────────────────────────────────

  createForm!: FormGroup;
  editForm!: FormGroup;
  resetPasswordForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    public readonly authService: AuthService,
    private readonly getUsersGQL: GetUsersGQL,
    private readonly createUserGQL: CreateUserGQL,
    private readonly updateUserGQL: UpdateUserGQL,
    private readonly deleteUserGQL: DeleteUserGQL,
    private readonly blockClientGQL: BlockClientGQL,
    private readonly unblockClientGQL: UnblockClientGQL,
    private readonly adminResetPasswordGQL: AdminResetPasswordGQL,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.buildForms();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Data ──────────────────────────────────────────────────────────────────

  loadData(): void {
    if (this.authService.isSuperAdmin()) {
      this.loadAdmins();
    } else {
      this.loadSelfAndManagers();
    }
  }

  loadAdmins(after: string | null = null): void {
    this.isLoading = true;

    // Build where — always filter to Admin role, add text search if present
    const roleFilter = { role: { eq: UserRole.Admin } };
    const searchFilter = this.adminSearch.trim()
      ? {
        or: [
          { firstName: { contains: this.adminSearch } },
          { lastName: { contains: this.adminSearch } },
          { username: { contains: this.adminSearch } },
          { email: { contains: this.adminSearch } },
        ],
      }
      : null;

    const where = searchFilter
      ? { and: [roleFilter, searchFilter] }
      : roleFilter;

    this.getUsersGQL
      .fetch({
        variables: {
          first: PAGE_SIZE,
          ...(after ? { after } : {}),
          where,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          const conn = res.data?.users;
          this.adminPageInfo = conn?.pageInfo as PageInfo ?? null;
          this.adminTotal = conn?.totalCount ?? 0;
          this.admins = (conn?.edges ?? []).map(e => this.toRow(e?.node));
        },
        error: () => { this.isLoading = false; },
      });
  }

  loadSelfAndManagers(after: string | null = null): void {
    this.isLoading = true;

    const roleFilter = { role: { eq: UserRole.Manager } };
    const searchFilter = this.managerSearch.trim()
      ? {
        or: [
          { firstName: { contains: this.managerSearch } },
          { lastName: { contains: this.managerSearch } },
          { username: { contains: this.managerSearch } },
          { email: { contains: this.managerSearch } },
        ],
      }
      : null;

    const where = searchFilter
      ? { and: [roleFilter, searchFilter] }
      : roleFilter;

    this.getUsersGQL
      .fetch({
        variables: {
          first: PAGE_SIZE,
          ...(after ? { after } : {}),
          where,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          const conn = res.data?.users;
          this.managerPageInfo = conn?.pageInfo as PageInfo ?? null;
          this.managerTotal = conn?.totalCount ?? 0;

          const all = (conn?.edges ?? []).map(e => this.toRow(e?.node));
          this.selfRow = all.find(u => u.id === this.currentUser?.id) ?? null;
          this.managers = all.filter(u => u.role === UserRole.Manager);
        },
        error: () => { this.isLoading = false; },
      });
  }

  private toRow(u: any): UserRow {
    return {
      id: u.id,
      username: u.username,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: this.normalizeRole(u.role),
      isBlocked: u.isBlocked ?? false,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt ?? u.createdAt,
    };
  }

  private normalizeRole(role: string): UserRole {
    const map: Record<string, UserRole> = {
      SUPERADMIN: UserRole.Superadmin,
      ADMIN: UserRole.Admin,
      MANAGER: UserRole.Manager,
    };
    return map[role?.toUpperCase()] ?? role as UserRole;
  }

  // ─── Pagination ────────────────────────────────────────────────────────────

  adminNextPage(): void {
    if (!this.adminPageInfo?.hasNextPage || !this.adminPageInfo.endCursor) return;
    this.adminCursorStack.push(this.adminPageInfo.endCursor);
    this.loadAdmins(this.adminPageInfo.endCursor);
  }

  adminPrevPage(): void {
    if (this.adminCursorStack.length <= 1) return;
    this.adminCursorStack.pop();
    this.loadAdmins(this.adminCursorStack[this.adminCursorStack.length - 1]);
  }

  managerNextPage(): void {
    if (!this.managerPageInfo?.hasNextPage || !this.managerPageInfo.endCursor) return;
    this.managerCursorStack.push(this.managerPageInfo.endCursor);
    this.loadSelfAndManagers(this.managerPageInfo.endCursor);
  }

  managerPrevPage(): void {
    if (this.managerCursorStack.length <= 1) return;
    this.managerCursorStack.pop();
    this.loadSelfAndManagers(this.managerCursorStack[this.managerCursorStack.length - 1]);
  }

  // ─── Search — reset cursor and reload via backend ─────────────────────────

  onAdminSearch(value: string): void {
    this.adminSearch = value;
    this.adminCursorStack = [null];
    this.loadAdmins();
  }

  onManagerSearch(value: string): void {
    this.managerSearch = value;
    this.managerCursorStack = [null];
    this.loadSelfAndManagers();
  }

  // ─── Modal Controls ────────────────────────────────────────────────────────

  openCreateAdmin(): void {
    this.createForm.reset();
    this.modalTarget = 'admin';
    this.modalError = null;
    this.activeModal = 'create';
  }

  openCreateManager(): void {
    this.createForm.reset();
    this.modalTarget = 'manager';
    this.modalError = null;
    this.activeModal = 'create';
  }

  openEdit(user: UserRow, target: ModalTarget): void {
    this.selectedUser = user;
    this.modalTarget = target;
    this.editForm.patchValue({ firstName: user.firstName, lastName: user.lastName, email: user.email });
    this.modalError = null;
    this.activeModal = 'edit';
  }

  openDelete(user: UserRow, target: ModalTarget): void {
    this.selectedUser = user;
    this.modalTarget = target;
    this.modalError = null;
    this.activeModal = 'delete';
  }

  openResetPassword(user: UserRow, target: ModalTarget): void {
    this.selectedUser = user;
    this.modalTarget = target;
    this.resetPasswordForm.reset();
    this.modalError = null;
    this.activeModal = 'resetPassword';
  }

  closeModal(): void {
    this.activeModal = null;
    this.modalTarget = null;
    this.selectedUser = null;
    this.modalError = null;
    this.modalLoading = false;
  }

  // ─── Mutations ─────────────────────────────────────────────────────────────

  submitCreate(): void {
    if (this.createForm.invalid || this.modalLoading) { this.createForm.markAllAsTouched(); return; }
    this.modalLoading = true;
    this.modalError = null;
    const v = this.createForm.value;

    this.createUserGQL
      .mutate({
        variables: {
          username: v.username,
          email: v.email,
          firstName: v.firstName,
          lastName: v.lastName,
          password: v.password,
          role: this.authService.isSuperAdmin() ? UserRole.Admin : UserRole.Manager,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.closeModal(); this.loadData(); },
        error: (e) => { this.modalLoading = false; this.modalError = this.parseError(e); },
      });
  }

  submitEdit(): void {
    if (this.editForm.invalid || !this.selectedUser || this.modalLoading) { this.editForm.markAllAsTouched(); return; }
    this.modalLoading = true;
    this.modalError = null;
    const v = this.editForm.value;

    this.updateUserGQL
      .mutate({
        variables: {
          id: this.selectedUser.id,
          firstName: v.firstName,
          lastName: v.lastName,
          email: v.email,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.closeModal(); this.loadData(); },
        error: (e) => { this.modalLoading = false; this.modalError = this.parseError(e); },
      });
  }

  submitDelete(): void {
    if (!this.selectedUser || this.modalLoading) return;
    this.modalLoading = true;

    this.deleteUserGQL
      .mutate({ variables: { id: this.selectedUser.id } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.closeModal(); this.loadData(); },
        error: (e) => { this.modalLoading = false; this.modalError = this.parseError(e); },
      });
  }

  toggleBlock(user: UserRow): void {
    if (user.isBlocked) {
      this.unblockClientGQL
        .mutate({ variables: { clientId: user.id } })
        .pipe(takeUntil(this.destroy$))
        .subscribe({ next: () => this.loadData() });
    } else {
      this.blockClientGQL
        .mutate({ variables: { clientId: user.id } })
        .pipe(takeUntil(this.destroy$))
        .subscribe({ next: () => this.loadData() });
    }
  }

  submitResetPassword(): void {
    if (this.resetPasswordForm.invalid || !this.selectedUser || this.modalLoading) { this.resetPasswordForm.markAllAsTouched(); return; }
    this.modalLoading = true;
    this.modalError = null;

    this.adminResetPasswordGQL
      .mutate({
        variables: {
          userId: this.selectedUser.id,
          newPassword: this.resetPasswordForm.value.newPassword,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.closeModal(),
        error: (e) => { this.modalLoading = false; this.modalError = this.parseError(e); },
      });
  }

  // ─── Template Helpers ──────────────────────────────────────────────────────

  initials(user: UserRow): string {
    return ((user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')).toUpperCase();
  }

  fullName(user: UserRow): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  formatDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ─── Private ───────────────────────────────────────────────────────────────

  private buildForms(): void {
    this.createForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.editForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  private parseError(e: any): string {
    return e?.graphQLErrors?.[0]?.message ?? e?.message ?? 'Ndodhi një gabim.';
  }
}
