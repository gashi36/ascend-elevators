import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  CityEnum,
  UserRole,
  SortEnumType,
  BuildingSortInput,
  GetBuildingsGQL,
  GetUsersGQL,
  CreateBuildingGQL,
  DeleteBuildingGQL,
} from '../../../../graphql/generated/graphql';
import { AuthService } from '../../../Guards/auth.service';

// ─── Models ───────────────────────────────────────────────────────────────────

interface BuildingRow {
  id: string;
  name: string;
  address: string;
  city: string;
  adminId: string;
  adminName: string;
  entryCount: number;
  createdAt: string;
}

interface AdminOption {
  id: string;
  name: string;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

type ModalMode = 'create' | 'delete' | null;

const PAGE_SIZE = 12;

// ─── City labels (Albanian) ───────────────────────────────────────────────────

export const CITY_LABELS: Record<string, string> = {
  Prishtina: 'Prishtinë', Prizren: 'Prizren', Peja: 'Pejë',
  Gjakova: 'Gjakovë', Ferizaj: 'Ferizaj', Gjilan: 'Gjilan',
  Mitrovica: 'Mitrovicë', Podujeva: 'Podujevë', Vushtrria: 'Vushtrri',
  Skenderaj: 'Skenderaj', Drenas: 'Drenas', Malisheva: 'Malishevë',
  Lipjan: 'Lipjan', Kacanik: 'Kaçanik', Istog: 'Istog',
  Klina: 'Klinë', Rahovec: 'Rahovec', Suhareka: 'Suharekë',
  Dragash: 'Dragash', Shtime: 'Shtime', Viti: 'Vitia',
  Kamenica: 'Kamenicë', Decan: 'Deçan', Junik: 'Junik',
  Mamusha: 'Mamushë', HaniIElezet: 'Hani i Elezit', Gracanica: 'Graçanicë',
  NovoBrdo: 'Novobërdë', Ranillug: 'Ranillug', Partesh: 'Partesh',
  Klokot: 'Klokot', Strpce: 'Shtërpcë',
};

export function resolveCityLabel(cityValue: string): string {
  if (!cityValue) return '—';
  if (CITY_LABELS[cityValue]) return CITY_LABELS[cityValue];
  const key = (Object.keys(CityEnum) as Array<keyof typeof CityEnum>)
    .find(k => CityEnum[k] === cityValue);
  if (key && CITY_LABELS[key]) return CITY_LABELS[key];
  return cityValue;
}

// ─── Validator ────────────────────────────────────────────────────────────────

function nonEmptyString(ctrl: AbstractControl) {
  return ctrl.value?.trim()?.length > 0 ? null : { required: true };
}

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './buildings-admin.component.html',
})
export class BuildingsAdminComponent implements OnInit, OnDestroy {

  private readonly destroy$ = new Subject<void>();

  readonly cityOptions = Object.values(CityEnum);
  readonly cityLabels = CITY_LABELS;

  // ─── State ─────────────────────────────────────────────────────────────────

  buildings: BuildingRow[] = [];
  isLoading = false;
  search = '';
  pageInfo: PageInfo | null = null;
  totalCount = 0;
  private cursorStack: (string | null)[] = [null];
  get currentPage(): number { return this.cursorStack.length; }

  // ─── Sort ──────────────────────────────────────────────────────────────────

  sortField: keyof Pick<BuildingSortInput, 'name' | 'city'> = 'name';
  sortDir: SortEnumType = SortEnumType.Asc;

  get sortValue(): string {
    return `${this.sortField}:${this.sortDir === SortEnumType.Desc ? 'DESC' : 'ASC'}`;
  }

  // ─── Admin picker (superadmin only) ────────────────────────────────────────

  adminOptions: AdminOption[] = [];
  loadingAdmins = false;

  // ─── Modal ─────────────────────────────────────────────────────────────────

  activeModal: ModalMode = null;
  selectedId: string | null = null;
  selectedName = '';
  modalLoading = false;
  modalError: string | null = null;

  createForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    public readonly authService: AuthService,
    private readonly getBuildingsGQL: GetBuildingsGQL,
    private readonly getUsersGQL: GetUsersGQL,
    private readonly createBuildingGQL: CreateBuildingGQL,
    private readonly deleteBuildingGQL: DeleteBuildingGQL,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadBuildings();
    if (this.authService.isSuperAdmin()) {
      this.loadAdminOptions();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Data ──────────────────────────────────────────────────────────────────

  loadBuildings(after: string | null = null): void {
    this.isLoading = true;

    const where = this.search.trim()
      ? {
        or: [
          { name: { contains: this.search.trim() } },
          { address: { contains: this.search.trim() } },
        ]
      }
      : undefined;

    const order: BuildingSortInput[] = this.sortField === 'city'
      ? [{ city: this.sortDir }]
      : [{ name: this.sortDir }];

    this.getBuildingsGQL
      .fetch({
        variables: {
          first: PAGE_SIZE,
          ...(after ? { after } : {}),
          ...(where ? { where } : {}),
          order,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          const conn = res.data?.buildings;
          this.pageInfo = conn?.pageInfo as PageInfo ?? null;
          this.totalCount = conn?.totalCount ?? 0;
          this.buildings = (conn?.edges ?? [])
            .filter(e => !!e?.node)
            .map(e => this.toRow(e!.node));
        },
        error: () => { this.isLoading = false; },
      });
  }

  private loadAdminOptions(): void {
    this.loadingAdmins = true;

    this.getUsersGQL
      .fetch({ variables: { first: 100, where: { role: { eq: UserRole.Admin } } } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loadingAdmins = false;
          this.adminOptions = (res.data?.users?.edges ?? [])
            .filter(e => !!e?.node?.id)
            .map(e => ({
              id: e!.node!.id,
              name: `${e!.node!.firstName} ${e!.node!.lastName}`.trim(),
            }));
        },
        error: () => { this.loadingAdmins = false; },
      });
  }

  private toRow(b: any): BuildingRow {
    return {
      id: b.id,
      name: b.name,
      address: b.address,
      city: b.city,
      adminId: b.adminId,
      adminName: b.admin ? `${b.admin.firstName} ${b.admin.lastName}`.trim() : '—',
      entryCount: b.entries?.length ?? 0,
      createdAt: b.createdAt,
    };
  }

  // ─── Pagination ────────────────────────────────────────────────────────────

  nextPage(): void {
    if (!this.pageInfo?.hasNextPage || !this.pageInfo.endCursor) return;
    this.cursorStack.push(this.pageInfo.endCursor);
    this.loadBuildings(this.pageInfo.endCursor);
  }

  prevPage(): void {
    if (this.cursorStack.length <= 1) return;
    this.cursorStack.pop();
    this.loadBuildings(this.cursorStack[this.cursorStack.length - 1]);
  }

  // ─── Search ────────────────────────────────────────────────────────────────

  onSearch(value: string): void {
    this.search = value;
    this.cursorStack = [null];
    this.loadBuildings();
  }

  // ─── Sort ──────────────────────────────────────────────────────────────────

  onSort(value: string): void {
    const [field, dirStr] = value.split(':');
    this.sortField = field as keyof Pick<BuildingSortInput, 'name' | 'city'>;
    this.sortDir = dirStr === 'DESC' ? SortEnumType.Desc : SortEnumType.Asc;
    this.cursorStack = [null];
    this.loadBuildings();
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  goToBuilding(id: string): void {
    this.router.navigate(['/admin-panel/buildings', id]);
  }

  // ─── Modal ─────────────────────────────────────────────────────────────────

  openCreate(): void {
    this.createForm.patchValue({ name: '', address: '', city: null, adminId: null });
    this.entryNames.clear();
    this.addEntry();
    this.createForm.markAsUntouched();
    this.modalError = null;
    this.activeModal = 'create';
  }

  openDelete(b: BuildingRow, event: Event): void {
    event.stopPropagation();
    this.selectedId = b.id;
    this.selectedName = b.name;
    this.modalError = null;
    this.activeModal = 'delete';
  }

  closeModal(): void {
    this.activeModal = null;
    this.selectedId = null;
    this.modalError = null;
    this.modalLoading = false;
  }

  // ─── Entry names FormArray ─────────────────────────────────────────────────

  get entryNames(): FormArray {
    return this.createForm.get('entryNames') as FormArray;
  }

  addEntry(): void {
    this.entryNames.push(this.fb.control('', [nonEmptyString]));
  }

  removeEntry(i: number): void {
    if (this.entryNames.length > 1) this.entryNames.removeAt(i);
  }

  // ─── Mutations ─────────────────────────────────────────────────────────────

  submitCreate(): void {
    if (this.createForm.invalid || this.modalLoading) {
      this.createForm.markAllAsTouched();
      return;
    }
    this.modalLoading = true;
    this.modalError = null;
    const v = this.createForm.value;

    this.createBuildingGQL
      .mutate({
        variables: {
          name: v.name.trim(),
          address: v.address.trim(),
          city: v.city,
          entryNames: (v.entryNames as string[]).map((n: string) => n.trim()),
          ...(this.authService.isSuperAdmin() && v.adminId ? { adminId: v.adminId } : {}),
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.closeModal();
          const id = res.data?.createBuilding?.id;
          if (id) this.router.navigate(['/admin-panel/buildings', id]);
          else this.loadBuildings();
        },
        error: (e) => { this.modalLoading = false; this.modalError = this.parseError(e); },
      });
  }

  submitDelete(): void {
    if (!this.selectedId || this.modalLoading) return;
    this.modalLoading = true;

    this.deleteBuildingGQL
      .mutate({ variables: { id: this.selectedId } })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.closeModal(); this.loadBuildings(); },
        error: (e) => { this.modalLoading = false; this.modalError = this.parseError(e); },
      });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  cityLabel(city: string): string { return resolveCityLabel(city); }

  formatDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  canCreate(): boolean { return this.authService.isSuperAdmin() || this.authService.isAdmin(); }
  canDelete(): boolean { return this.authService.isSuperAdmin(); }

  private buildForm(): void {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: [null, Validators.required],
      adminId: [null],
      entryNames: this.fb.array([this.fb.control('', [nonEmptyString])]),
    });
  }

  private parseError(e: any): string {
    return e?.graphQLErrors?.[0]?.message ?? e?.message ?? 'Ndodhi një gabim.';
  }
}
