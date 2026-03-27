import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../Guards/auth.service';
import { resolveCityLabel, CITY_LABELS } from '../buildings-admin/buildings-admin.component';
import {
  CityEnum,
  UserRole,
  GetBuildingByIdGQL,
  GetUsersGQL,
  UpdateBuildingGQL,
  CreateBuildingEntryGQL,
  UpdateBuildingEntryGQL,
  DeleteBuildingEntryGQL,
  AssignBuildingAdminGQL,
  RemoveBuildingAdminGQL,
} from '../../../../graphql/generated/graphql';

// ─── Models ───────────────────────────────────────────────────────────────────

interface EntryRow {
  id: string;
  name: string;
  order: number;
  tenantCount: number;
}

interface ManagerRow {
  id: string;
  username: string;
  name: string;
}

interface BuildingDetail {
  id: string;
  name: string;
  address: string;
  city: string;
  adminId: string;
  adminName: string;
  createdAt: string;
  updatedAt: string;
  entries: EntryRow[];
  administrators: ManagerRow[];
  tenantCount: number;
}

interface ManagerOption {
  id: string;
  name: string;
}

type ModalMode = 'editBuilding' | 'addEntry' | 'editEntry' | 'deleteEntry' | 'assignManager' | null;

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-building-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './building-details.component.html',
})
export class BuildingDetailsComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  readonly cityOptions = Object.values(CityEnum);
  readonly cityLabels = CITY_LABELS;

  // ─── State ─────────────────────────────────────────────────────────────────

  buildingId = '';
  building: BuildingDetail | null = null;
  isLoading = true;

  managerOptions: ManagerOption[] = [];
  loadingManagers = false;
  private managersLoaded = false;

  // ─── Modal ─────────────────────────────────────────────────────────────────

  activeModal: ModalMode = null;
  selectedEntry: EntryRow | null = null;
  modalLoading = false;
  modalError: string | null = null;

  editBuildingForm!: FormGroup;
  entryForm!: FormGroup;
  assignForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly authService: AuthService,
    private readonly getBuildingByIdGQL: GetBuildingByIdGQL,
    private readonly getUsersGQL: GetUsersGQL,
    private readonly updateBuildingGQL: UpdateBuildingGQL,
    private readonly createEntryGQL: CreateBuildingEntryGQL,
    private readonly updateEntryGQL: UpdateBuildingEntryGQL,
    private readonly deleteEntryGQL: DeleteBuildingEntryGQL,
    private readonly assignManagerGQL: AssignBuildingAdminGQL,
    private readonly removeManagerGQL: RemoveBuildingAdminGQL,
  ) { }

  ngOnInit(): void {
    this.buildForms();
    this.buildingId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.buildingId) { this.router.navigate(['/admin-panel/buildings']); return; }
    this.loadBuilding();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Data ──────────────────────────────────────────────────────────────────

  loadBuilding(): void {
    this.isLoading = true;
    this.managersLoaded = false;

    this.getBuildingByIdGQL
      .fetch({ variables: { id: this.buildingId } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          const b = res.data?.buildingById;
          if (!b) { this.router.navigate(['/admin-panel/buildings']); return; }
          this.building = this.toDetail(b);
        },
        error: () => {
          this.isLoading = false;
          this.router.navigate(['/admin-panel/buildings']);
        },
      });
  }

  private loadManagerOptions(): void {
    if (this.managersLoaded || !this.building) return;
    this.loadingManagers = true;

    this.getUsersGQL
      .fetch({ variables: { first: 100, where: { role: { eq: UserRole.Manager } } } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loadingManagers = false;
          this.managersLoaded = true;
          const assigned = new Set(this.building!.administrators.map(a => a.id));

          this.managerOptions = (res.data?.users?.edges ?? [])
            .filter(e => !!e?.node?.id && !assigned.has(e.node.id))
            .map(e => ({
              id: e!.node!.id,
              name: `${e!.node!.firstName} ${e!.node!.lastName}`.trim(),
            }));
        },
        error: () => { this.loadingManagers = false; },
      });
  }

  private toDetail(b: any): BuildingDetail {
    return {
      id: b.id,
      name: b.name,
      address: b.address,
      city: b.city,
      adminId: b.adminId,
      adminName: b.admin ? `${b.admin.firstName} ${b.admin.lastName}`.trim() : '—',
      createdAt: b.createdAt,
      updatedAt: b.updatedAt ?? b.createdAt,
      entries: (b.entries ?? []).map((e: any) => ({
        id: e.id,
        name: e.name,
        order: e.order ?? 0,
        tenantCount: e.tenants?.length ?? 0,
      })),
      administrators: (b.administrators ?? []).map((a: any) => ({
        id: a.id,
        username: a.username,
        name: `${a.firstName} ${a.lastName}`.trim(),
      })),
      tenantCount: b.tenants?.length ?? 0,
    };
  }

  // ─── Permissions ───────────────────────────────────────────────────────────

  canEdit(): boolean { return this.authService.isSuperAdmin() || this.authService.isAdmin(); }
  canManageManagers(): boolean { return this.authService.isSuperAdmin() || this.authService.isAdmin(); }

  // ─── Navigation ────────────────────────────────────────────────────────────

  goBack(): void { this.router.navigate(['/admin-panel/buildings']); }

  goToEntry(entryId: string): void {
    this.router.navigate(['/admin-panel/buildings', this.buildingId, 'entries', entryId]);
  }

  // ─── Modal Controls ────────────────────────────────────────────────────────

  openEditBuilding(): void {
    if (!this.building) return;
    this.editBuildingForm.patchValue({
      name: this.building.name,
      address: this.building.address,
      city: this.building.city,
    });
    this.editBuildingForm.markAsUntouched();
    this.openModal('editBuilding');
  }

  openAddEntry(): void {
    this.entryForm.reset();
    this.entryForm.markAsUntouched();
    this.openModal('addEntry');
  }

  openEditEntry(entry: EntryRow): void {
    this.selectedEntry = entry;
    this.entryForm.patchValue({ name: entry.name });
    this.entryForm.markAsUntouched();
    this.openModal('editEntry');
  }

  openDeleteEntry(entry: EntryRow): void {
    this.selectedEntry = entry;
    this.openModal('deleteEntry');
  }

  openAssignManager(): void {
    this.assignForm.reset();
    this.assignForm.markAsUntouched();
    this.loadManagerOptions();
    this.openModal('assignManager');
  }

  private openModal(mode: ModalMode): void {
    this.modalError = null;
    this.activeModal = mode;
  }

  closeModal(): void {
    this.activeModal = null;
    this.selectedEntry = null;
    this.modalError = null;
    this.modalLoading = false;
  }

  // ─── Mutations ─────────────────────────────────────────────────────────────

  submitEditBuilding(): void {
    if (this.editBuildingForm.invalid || this.modalLoading) {
      this.editBuildingForm.markAllAsTouched(); return;
    }
    this.modalLoading = true;
    this.modalError = null;
    const v = this.editBuildingForm.value;

    this.updateBuildingGQL
      .mutate({ variables: { id: this.buildingId, name: v.name.trim(), address: v.address.trim(), city: v.city } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.closeModal(); this.loadBuilding(); },
        error: (e) => { this.modalLoading = false; this.modalError = this.parseError(e); },
      });
  }

  submitAddEntry(): void {
    if (this.entryForm.invalid || this.modalLoading) {
      this.entryForm.markAllAsTouched(); return;
    }
    this.modalLoading = true;
    this.modalError = null;

    this.createEntryGQL
      .mutate({ variables: { name: this.entryForm.value.name.trim(), buildingId: this.buildingId } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.closeModal(); this.loadBuilding(); },
        error: (e) => { this.modalLoading = false; this.modalError = this.parseError(e); },
      });
  }

  submitEditEntry(): void {
    if (this.entryForm.invalid || !this.selectedEntry || this.modalLoading) {
      this.entryForm.markAllAsTouched(); return;
    }
    this.modalLoading = true;
    this.modalError = null;

    this.updateEntryGQL
      .mutate({ variables: { id: this.selectedEntry.id, name: this.entryForm.value.name.trim() } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.closeModal(); this.loadBuilding(); },
        error: (e) => { this.modalLoading = false; this.modalError = this.parseError(e); },
      });
  }

  submitDeleteEntry(): void {
    if (!this.selectedEntry || this.modalLoading) return;
    this.modalLoading = true;

    this.deleteEntryGQL
      .mutate({ variables: { id: this.selectedEntry.id } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.closeModal(); this.loadBuilding(); },
        error: (e) => { this.modalLoading = false; this.modalError = this.parseError(e); },
      });
  }

  submitAssignManager(): void {
    if (this.assignForm.invalid || this.modalLoading) {
      this.assignForm.markAllAsTouched(); return;
    }
    this.modalLoading = true;
    this.modalError = null;

    this.assignManagerGQL
      .mutate({ variables: { buildingId: this.buildingId, userId: this.assignForm.value.managerId } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.closeModal(); this.loadBuilding(); },
        error: (e) => { this.modalLoading = false; this.modalError = this.parseError(e); },
      });
  }

  removeManager(managerId: string): void {
    this.removeManagerGQL
      .mutate({ variables: { buildingId: this.buildingId, userId: managerId } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadBuilding(),
        error: (e) => console.error('[removeManager]', this.parseError(e)),
      });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  cityLabel(city: string): string { return resolveCityLabel(city); }

  formatDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  private buildForms(): void {
    this.editBuildingForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: [null, Validators.required],
    });
    this.entryForm = this.fb.group({ name: ['', Validators.required] });
    this.assignForm = this.fb.group({ managerId: [null, Validators.required] });
  }

  private parseError(e: any): string {
    return e?.graphQLErrors?.[0]?.message ?? e?.message ?? 'Ndodhi një gabim.';
  }
}
