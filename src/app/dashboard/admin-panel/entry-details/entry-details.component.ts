import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../funcServices/auth.service';
import {
  GetBuildingEntryByIdGQL,
  UpdateBuildingEntryGQL,
  DeleteBuildingEntryGQL,
} from '../../../../graphql/generated/graphql';
import { TenantTableComponent } from '../tenant-table/tenant-table.component';
import { TranslatePipe } from '../../../pipes/translate.pipe';

// ─── Models ───────────────────────────────────────────────────────────────────

interface MonthlyDecision {
  id: string;
  year: number;
  month: number;
  status: string;
  notes: string;
  updatedAt: string;
}

interface Tenant {
  id: string;
  name: string;
  unitNumber: string;
  floor: number | null;
  contactEmail: string | null;
  contactPhone: string;
  accessKeyNR: string;
  monthlyDecisions: MonthlyDecision[];
}

interface BuildingInfo {
  id: string;
  name: string;
  city: string;
  admin: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface EntryDetail {
  id: string;
  name: string;
  order: number;
  buildingId: string;
  adminId: string;
  createdAt: string;
  building: BuildingInfo;
  tenants: Tenant[];
}

type ModalMode = 'editEntry' | 'deleteEntry' | null;

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-entry-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TenantTableComponent, TranslatePipe],
  templateUrl: './entry-details.component.html',
  styleUrls: ['./entry-details.component.scss']
})
export class EntryDetailsComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  // ─── State ─────────────────────────────────────────────────────────────────

  entryId = '';
  buildingId = '';
  entry: EntryDetail | null = null;
  isLoading = true;
  error: string | null = null;

  // ─── Modal ─────────────────────────────────────────────────────────────────

  activeModal: ModalMode = null;
  modalLoading = false;
  modalError: string | null = null;

  editEntryForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly authService: AuthService,
    private readonly getEntryByIdGQL: GetBuildingEntryByIdGQL,
    private readonly updateEntryGQL: UpdateBuildingEntryGQL,
    private readonly deleteEntryGQL: DeleteBuildingEntryGQL,
  ) {
    this.editEntryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    // Get both buildingId and entryId from route params
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.buildingId = params['buildingId'];
      this.entryId = params['entryId'];


      if (this.entryId) {
        this.loadEntry();
      } else {
        console.error('No entry ID found, redirecting...');
        this.router.navigate(['/admin-panel/buildings']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Data Loading ──────────────────────────────────────────────────────────

  loadEntry(): void {
    this.isLoading = true;
    this.error = null;


    this.getEntryByIdGQL
      .fetch({ variables: { id: this.entryId } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          const entryData = res.data?.buildingEntryById;


          if (!entryData) {
            console.error('No entry data received for ID:', this.entryId);
            this.error = 'Entry not found';
            return;
          }

          // Transform the data to match our interface
          this.entry = this.transformEntryData(entryData);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error loading entry:', err);
          this.error = err?.message || 'Failed to load entry';
        },
      });
  }

  // Transform GraphQL data to match our interface
  private transformEntryData(data: any): EntryDetail {
    return {
      id: data.id,
      name: data.name,
      order: data.order ?? 0,
      buildingId: data.buildingId,
      adminId: data.adminId,
      createdAt: data.createdAt,
      building: {
        id: data.building?.id || '',
        name: data.building?.name || 'Unknown',
        city: data.building?.city || 'Unknown',
        admin: {
          id: data.building?.admin?.id || '',
          firstName: data.building?.admin?.firstName || '',
          lastName: data.building?.admin?.lastName || '',
        }
      },
      tenants: (data.tenants ?? []).map((tenant: any) => ({
        id: tenant.id,
        name: tenant.name,
        unitNumber: tenant.unitNumber,
        floor: tenant.floor ?? null,
        contactEmail: tenant.contactEmail ?? null,
        contactPhone: tenant.contactPhone,
        accessKeyNR: tenant.accessKeyNR,
        monthlyDecisions: (tenant.monthlyDecisions ?? []).map((decision: any) => ({
          id: decision.id,
          year: decision.year,
          month: decision.month,
          status: decision.status,
          notes: decision.notes,
          updatedAt: decision.updatedAt,
        }))
      }))
    };
  }

  // ─── Permissions ───────────────────────────────────────────────────────────

  canEdit(): boolean {
    return this.authService.isSuperAdmin() || this.authService.isAdmin();
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  goBack(): void {
    this.router.navigate(['/admin-panel/buildings', this.buildingId]);
  }

  // ─── Modal Controls ────────────────────────────────────────────────────────

  openEditEntry(): void {
    if (!this.entry) return;
    this.editEntryForm.patchValue({
      name: this.entry.name,
    });
    this.editEntryForm.markAsUntouched();
    this.openModal('editEntry');
  }

  openDeleteEntry(): void {
    this.openModal('deleteEntry');
  }

  private openModal(mode: ModalMode): void {
    this.modalError = null;
    this.activeModal = mode;
  }

  closeModal(): void {
    this.activeModal = null;
    this.modalError = null;
    this.modalLoading = false;
  }

  // ─── Mutations ─────────────────────────────────────────────────────────────

  submitEditEntry(): void {
    if (this.editEntryForm.invalid || this.modalLoading) {
      this.editEntryForm.markAllAsTouched();
      return;
    }

    this.modalLoading = true;
    this.modalError = null;

    this.updateEntryGQL
      .mutate({ variables: { id: this.entryId, name: this.editEntryForm.value.name.trim() } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeModal();
          this.loadEntry();
        },
        error: (e) => {
          this.modalLoading = false;
          this.modalError = this.parseError(e);
        },
      });
  }

  submitDeleteEntry(): void {
    if (this.modalLoading) return;

    this.modalLoading = true;
    this.modalError = null;

    this.deleteEntryGQL
      .mutate({ variables: { id: this.entryId } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeModal();
          // Navigate back to building details after deletion
          this.router.navigate(['/admin-panel/buildings', this.buildingId]);
        },
        error: (e) => {
          this.modalLoading = false;
          this.modalError = this.parseError(e);
        },
      });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  formatDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('sq-AL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTenantCount(): number {
    return this.entry?.tenants?.length ?? 0;
  }

  private parseError(e: any): string {
    return e?.graphQLErrors?.[0]?.message ?? e?.message ?? 'Ndodhi një gabim.';
  }
}
