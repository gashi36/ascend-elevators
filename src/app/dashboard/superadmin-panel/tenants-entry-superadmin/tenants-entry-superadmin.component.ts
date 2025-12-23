// tenants-superadmin.component.ts - OPTIMIZED VERSION
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { take, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  TenantsByBuildingEntryGQL,
  CreateOrUpdateMonthlyDecisionGQL,
  CreateMonthlyDecisionInput,
  DecisionStatus,
  CreateTenantGQL,
  GetBuildingsWithEntriesGQL
} from '../../../../graphql/generated/graphql';
import { AuthService } from '../../../Guards/auth.service';

@Component({
  selector: 'app-tenants-superadmin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tenants-entry-superadmin.component.html',
  styleUrls: ['./tenants-entry-superadmin.component.scss']
})
export class TenantsEntrySuperadminComponent implements OnInit {
  // Route parameters
  buildingId: string | null = null;
  entryId: string | null = null;
  buildingName: string = '';
  entryName: string = '';

  // Data
  tenants: any[] = [];
  filteredTenants: any[] = [];
  totalCount = 0;

  // Loading states
  isLoading = true;
  isLoadingMore = false;
  isLoadingBuildings = false;
  isCreatingTenant = false;
  isSavingDecision = false;

  // Errors
  error: string | null = null;

  // Modals
  showAddTenantModal = false;
  showDecisionModal = false;
  showBuildingSelection = false;

  // Selected items
  selectedTenant: any = null;

  // Forms
  newTenant = {
    buildingId: '',
    buildingEntryId: '',
    name: '',
    unitNumber: '',
    contactEmail: '',
    contactPhone: ''
  };

  decisionStatus: DecisionStatus = DecisionStatus.Pending;
  decisionMonth: number = new Date().getMonth() + 1;
  decisionYear: number = new Date().getFullYear();

  // Current user
  currentUserId: string | null = null;

  // Status enum for template
  DecisionStatus = DecisionStatus;

  // Pagination
  pageSize = 30;
  hasNextPage = false;
  endCursor: string | null = null;
  allLoaded = false;

  // Filtering and sorting
  searchTerm: string = '';
  sortField: 'name' | 'createdAt' | 'unitNumber' = 'name';
  sortDirection: 'ASC' | 'DESC' = 'ASC';
  filterStatus: 'all' | 'pending' | 'allowed' | 'denied' = 'all';

  // Search debounce
  private searchSubject = new Subject<string>();

  // Building data
  buildings: any[] = [];
  private buildingEntries: any[] = [];
  filteredBuildingEntries: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenantsByBuildingEntryGQL: TenantsByBuildingEntryGQL,
    private createOrUpdateMonthlyDecisionGQL: CreateOrUpdateMonthlyDecisionGQL,
    private createTenantGQL: CreateTenantGQL,
    private getBuildingsWithEntriesGQL: GetBuildingsWithEntriesGQL,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentUserId = this.extractUserIdFromToken();

    // Setup search debounce
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => this.resetAndLoadTenants());

    this.route.queryParams.subscribe(params => {
      this.buildingId = params['buildingId'] || params['buildingID'] || null;
      this.entryId = params['entryId'] || params['entryID'] || null;
      this.buildingName = params['buildingName'] || '';
      this.entryName = params['entryName'] || '';

      this.newTenant.buildingId = this.buildingId || '';
      this.newTenant.buildingEntryId = this.entryId || '';

      if (!this.entryId) {
        this.error = 'Entry ID is required to load tenants';
        this.isLoading = false;
        return;
      }

      if (!this.isValidUUID(this.entryId)) {
        this.error = 'Invalid Entry ID format';
        this.isLoading = false;
        return;
      }

      this.resetAndLoadTenants();
    });
  }

  // ===== PAYMENT CALCULATION METHODS =====

  private calculateTenantPaymentStatus(tenant: any): any {
    const currentDecision = this.getCurrentDecision(tenant);
    const today = new Date();

    // Get due day from backend (default to 1st)
    const dueDay = tenant.rentDueDayOfMonth || 1;

    // Calculate dates using UTC to avoid timezone issues
    const currentYear = today.getUTCFullYear();
    const currentMonth = today.getUTCMonth();

    // Create dates in UTC
    const paymentDueDate = new Date(Date.UTC(currentYear, currentMonth, dueDay));
    const nextMonthDueDate = new Date(Date.UTC(currentYear, currentMonth + 1, dueDay));

    // Calculate days difference
    const daysUntilDue = this.calculateDaysDifference(paymentDueDate, today);
    const isOverdue = daysUntilDue < 0 && (!currentDecision || currentDecision.status === DecisionStatus.Pending);
    const daysOverdue = isOverdue ? Math.abs(daysUntilDue) : 0;

    // Determine next payment date
    const nextPaymentDate = isOverdue ? paymentDueDate : nextMonthDueDate;
    const daysUntilNextPayment = this.calculateDaysDifference(nextPaymentDate, today);

    return {
      currentDecision,
      paymentDueDate,
      formattedPaymentDue: this.formatDate(paymentDueDate),
      daysUntilDue,
      isPaymentOverdue: isOverdue,
      daysOverdue,
      nextPaymentDate,
      daysUntilNextPayment,

      // Status display properties
      statusClass: this.getPaymentStatusClass(currentDecision?.status, isOverdue),
      statusText: this.getPaymentStatusText(currentDecision?.status, isOverdue),
      paymentStatusDetails: this.getPaymentStatusDetails(currentDecision, isOverdue, daysOverdue, daysUntilNextPayment)
    };
  }

  private getCurrentDecision(tenant: any): any {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    return tenant.monthlyDecisions?.find((d: any) =>
      d.year === currentYear && d.month === currentMonth
    );
  }

  private calculateDaysDifference(targetDate: Date, fromDate: Date): number {
    // Normalize both dates to start of day in UTC
    const target = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth(), targetDate.getUTCDate()));
    const from = new Date(Date.UTC(fromDate.getUTCFullYear(), fromDate.getUTCMonth(), fromDate.getUTCDate()));

    const timeDiff = target.getTime() - from.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  // ===== STATUS HELPER METHODS =====

  private getPaymentStatusClass(status: DecisionStatus | undefined, isOverdue: boolean): string {
    if (status === DecisionStatus.Allowed) return 'payment-status-allowed';
    if (status === DecisionStatus.Denied) return 'payment-status-denied';
    if (isOverdue) return 'payment-status-overdue';
    return 'payment-status-pending';
  }

  private getPaymentStatusText(status: DecisionStatus | undefined, isOverdue: boolean): string {
    if (status === DecisionStatus.Allowed) return '✅ Allowed';
    if (status === DecisionStatus.Denied) return '❌ Denied';
    if (isOverdue) return '⚠️ Overdue';
    return '⏳ Pending';
  }

  private getPaymentStatusDetails(decision: any, isOverdue: boolean, daysOverdue: number, daysUntilNext: number): string {
    if (decision?.status === DecisionStatus.Allowed) {
      return `Allowed on ${this.formatDate(decision.decisionDate)}`;
    }
    if (decision?.status === DecisionStatus.Denied) {
      return 'Denied';
    }
    if (isOverdue) {
      return `${daysOverdue} days overdue`;
    }
    if (daysUntilNext <= 7) {
      return `Due in ${daysUntilNext} days`;
    }
    return 'Payment pending';
  }

  // ===== DATA LOADING =====

  private extractUserIdFromToken(): string | null {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.nameid || payload?.sub || payload?.userId || payload?.id;
    } catch {
      return null;
    }
  }

  resetAndLoadTenants() {
    this.tenants = [];
    this.filteredTenants = [];
    this.endCursor = null;
    this.allLoaded = false;
    this.loadTenants();
  }

  loadTenants(cursor: string | null = null, loadMore: boolean = false) {
    if (!loadMore) this.isLoading = true;
    else this.isLoadingMore = true;

    if (!this.entryId) {
      this.handleLoadingError('Entry ID is missing');
      return;
    }

    const order = this.sortField ? [{ [this.sortField]: this.sortDirection }] : [];

    this.tenantsByBuildingEntryGQL.fetch({
      variables: {
        buildingEntryId: this.entryId,
        search: this.searchTerm || '',
        first: this.pageSize,
        after: cursor,
        order: order
      },
      fetchPolicy: 'network-only'
    }).subscribe({
      next: (result: any) => this.handleTenantsResponse(result, loadMore),
      error: (err: any) => this.handleLoadingError(`Failed to load tenants: ${err.message}`)
    });
  }

  private handleTenantsResponse(result: any, loadMore: boolean) {
    this.isLoading = false;
    this.isLoadingMore = false;

    if (result.errors?.length) {
      this.error = `GraphQL Error: ${result.errors[0].message}`;
      return;
    }

    const response = result.data?.tenantsByBuildingEntry;
    const rawTenants = response?.nodes || [];

    // Update pagination
    this.totalCount = response?.totalCount || 0;
    this.hasNextPage = response?.pageInfo?.hasNextPage || false;
    this.endCursor = response?.pageInfo?.endCursor || null;

    // Process tenants
    const processedTenants = rawTenants.map((tenant: any) => ({
      ...tenant,
      formattedLeaseEnd: this.formatDate(tenant.leaseEndDate),
      formattedLastPayment: this.formatDate(tenant.lastPaymentDate),
      formattedLeaseStart: this.formatDate(tenant.leaseStartDate),
      formattedCreatedAt: this.formatDate(tenant.createdAt),
      formattedMonthlyRent: tenant.monthlyRent ? `$${tenant.monthlyRent.toFixed(2)}` : 'N/A',
      ...this.calculateTenantPaymentStatus(tenant)
    }));

    if (loadMore) {
      this.tenants = [...this.tenants, ...processedTenants];
    } else {
      this.tenants = processedTenants;
    }

    this.applyClientSideFilter();

    // Check if all loaded
    if (processedTenants.length < this.pageSize) {
      this.allLoaded = true;
    }

    if (this.tenants.length === 0) {
      this.error = this.searchTerm ? 'No tenants found matching your search' : 'No tenants found';
    } else {
      this.error = null;
    }
  }

  private handleLoadingError(message: string) {
    this.isLoading = false;
    this.isLoadingMore = false;
    this.error = message;
  }

  // ===== BUILDING METHODS =====

  loadBuildings() {
    this.isLoadingBuildings = true;
    this.error = null;

    this.getBuildingsWithEntriesGQL.fetch({
      fetchPolicy: 'network-only'
    }).subscribe({
      next: (result: any) => this.handleBuildingsResponse(result),
      error: (err: any) => this.handleBuildingsError(err)
    });
  }

  private handleBuildingsResponse(result: any) {
    this.isLoadingBuildings = false;

    if (result.errors?.length) {
      this.error = `Error loading buildings: ${result.errors[0].message}`;
      return;
    }

    const buildings = result.data?.buildings;
    if (!buildings) {
      this.error = 'No building data returned';
      return;
    }

    this.processBuildingsData(buildings);
  }

  private handleBuildingsError(err: any) {
    this.isLoadingBuildings = false;
    this.error = `Failed to load buildings: ${err.message}`;
    console.error('Error loading buildings:', err);
  }

  private processBuildingsData(buildings: any[]) {
    this.buildings = [];
    this.buildingEntries = [];

    buildings.forEach((building: any) => {
      this.buildings.push({
        id: building.id,
        name: building.name || `Building ${building.id}`,
        address: building.address || '',
        city: building.city?.name || '',
        cityCode: building.city?.code || ''
      });

      if (building.entries?.length > 0) {
        building.entries.forEach((entry: any) => {
          this.buildingEntries.push({
            id: entry.id,
            buildingId: building.id,
            buildingName: building.name || `Building ${building.id}`,
            name: entry.name || 'Entry',
            displayName: `${building.name} - ${entry.name || 'Entry'}`
          });
        });
      } else {
        this.buildingEntries.push({
          id: building.id,
          buildingId: building.id,
          buildingName: building.name || `Building ${building.id}`,
          name: 'No entry available',
          displayName: `${building.name} (No entry available)`,
          hasNoEntry: true
        });
      }
    });

    this.buildings.sort((a, b) => a.name.localeCompare(b.name));
    this.buildingEntries.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  onBuildingChange() {
    this.newTenant.buildingEntryId = '';
    this.filteredBuildingEntries = this.newTenant.buildingId ?
      this.buildingEntries.filter(entry => entry.buildingId === this.newTenant.buildingId) :
      [];
  }

  // ===== TENANT CREATION =====

  openAddTenantModal() {
    this.showAddTenantModal = true;
    this.newTenant = {
      buildingId: this.buildingId || '',
      buildingEntryId: this.entryId || '',
      name: '',
      unitNumber: '',
      contactEmail: '',
      contactPhone: ''
    };

    if (this.showBuildingSelection) {
      this.loadBuildings();
      this.filteredBuildingEntries = [];
      if (this.buildingId) {
        this.onBuildingChange();
      }
    }
  }

  closeAddTenantModal() {
    this.showAddTenantModal = false;
    this.isCreatingTenant = false;
    this.error = null;
  }

  private validateTenantForm(): boolean {
    if (this.showBuildingSelection) {
      if (!this.newTenant.buildingId) {
        this.error = 'Please select a building';
        return false;
      }

      if (!this.newTenant.buildingEntryId) {
        this.error = 'Please select a building entry';
        return false;
      }

      const selectedEntry = this.buildingEntries.find(e => e.id === this.newTenant.buildingEntryId);
      if (selectedEntry?.hasNoEntry) {
        this.error = 'Selected building has no entries. Please create an entry for this building first.';
        return false;
      }
    }

    if (!this.newTenant.name?.trim()) {
      this.error = 'Tenant name is required';
      return false;
    }

    if (!this.newTenant.unitNumber?.trim()) {
      this.error = 'Unit number is required';
      return false;
    }

    if (this.newTenant.contactEmail?.trim() && !this.isValidEmail(this.newTenant.contactEmail)) {
      this.error = 'Please enter a valid email address';
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  createTenant() {
    if (!this.validateTenantForm()) return;

    this.isCreatingTenant = true;
    this.error = null;

    let buildingIdToUse = this.newTenant.buildingId;

    if (this.showBuildingSelection) {
      const selectedEntry = this.buildingEntries.find(e => e.id === this.newTenant.buildingEntryId);
      buildingIdToUse = selectedEntry?.buildingId || buildingIdToUse;
    }

    if (!buildingIdToUse) {
      this.error = 'Building ID is required';
      this.isCreatingTenant = false;
      return;
    }

    this.createTenantGQL.mutate({
      variables: {
        buildingEntryId: this.newTenant.buildingEntryId,
        buildingId: buildingIdToUse,
        name: this.newTenant.name,
        unitNumber: this.newTenant.unitNumber,
        contactEmail: this.newTenant.contactEmail || '',
        contactPhone: this.newTenant.contactPhone || ''
      }
    }).pipe(take(1)).subscribe({
      next: (result: any) => this.handleCreateTenantResponse(result),
      error: (err: any) => this.handleCreateTenantError(err)
    });
  }

  private handleCreateTenantResponse(result: any) {
    this.isCreatingTenant = false;

    if (result.errors?.length) {
      this.error = `Error: ${result.errors[0].message}`;
      return;
    }

    const newTenant = result.data?.createTenant;
    if (newTenant) {
      alert(`Tenant "${newTenant.name}" created successfully!`);
      this.closeAddTenantModal();
      this.refreshTenants();
    }
  }

  private handleCreateTenantError(err: any) {
    this.isCreatingTenant = false;
    this.error = `Failed to create tenant: ${err.message}`;
  }

  // ===== MONTHLY DECISION METHODS =====

  openDecisionModal(tenant: any) {
    this.selectedTenant = tenant;
    this.decisionStatus = tenant.currentDecision?.status || DecisionStatus.Pending;
    this.showDecisionModal = true;

    if (tenant.currentDecision) {
      this.decisionMonth = tenant.currentDecision.month;
      this.decisionYear = tenant.currentDecision.year;
    }

    if (!this.currentUserId) {
      this.currentUserId = this.extractUserIdFromToken();
    }
  }

  closeDecisionModal() {
    this.showDecisionModal = false;
    this.selectedTenant = null;
    this.decisionStatus = DecisionStatus.Pending;
    this.isSavingDecision = false;
  }

  saveMonthlyDecision() {
    if (!this.selectedTenant || !this.decisionYear || !this.decisionMonth) {
      this.error = 'Please fill all required fields';
      return;
    }

    if (!this.currentUserId) {
      this.currentUserId = this.extractUserIdFromToken();
      if (!this.currentUserId) {
        this.error = 'Unable to identify current user';
        return;
      }
    }

    const input: CreateMonthlyDecisionInput = {
      tenantId: this.selectedTenant.id,
      year: this.decisionYear,
      month: this.decisionMonth,
      status: this.decisionStatus,
      decidedByUserId: this.currentUserId,
    };

    this.isSavingDecision = true;

    this.createOrUpdateMonthlyDecisionGQL.mutate({ variables: { input } })
      .pipe(take(1))
      .subscribe({
        next: (result: any) => this.handleSaveDecisionResponse(result),
        error: (err: any) => this.handleSaveDecisionError(err)
      });
  }

  private handleSaveDecisionResponse(result: any) {
    this.isSavingDecision = false;

    if (result.errors?.length) {
      this.error = `Error: ${result.errors[0].message}`;
      return;
    }

    this.refreshTenants();
    alert('Payment decision saved successfully!');
    this.closeDecisionModal();
  }

  private handleSaveDecisionError(err: any) {
    this.isSavingDecision = false;
    this.error = `Failed to save decision: ${err.message}`;
  }

  // ===== FILTERING, SORTING & PAGINATION =====

  applyClientSideFilter() {
    if (this.filterStatus === 'all') {
      this.filteredTenants = [...this.tenants];
    } else {
      let statusToMatch: DecisionStatus;
      switch (this.filterStatus) {
        case 'allowed': statusToMatch = DecisionStatus.Allowed; break;
        case 'denied': statusToMatch = DecisionStatus.Denied; break;
        default: statusToMatch = DecisionStatus.Pending;
      }

      this.filteredTenants = this.tenants.filter(tenant => {
        const status = tenant.currentDecision?.status || DecisionStatus.Pending;
        return status === statusToMatch;
      });
    }
  }

  loadMore() {
    if (this.hasNextPage && this.endCursor && !this.allLoaded) {
      this.loadTenants(this.endCursor, true);
    }
  }

  refreshTenants() {
    this.resetAndLoadTenants();
  }

  onSearch() {
    this.searchSubject.next(this.searchTerm);
  }

  onSort(field: 'name' | 'createdAt' | 'unitNumber') {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortField = field;
      this.sortDirection = 'ASC';
    }
    this.resetAndLoadTenants();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterStatus = 'all';
    this.resetAndLoadTenants();
  }

  onFilterChange() {
    this.applyClientSideFilter();
  }

  // ===== HELPER METHODS =====

  private isValidUUID(uuid: string | null): boolean {
    if (!uuid) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  formatDate(date: Date | string | null): string {
    if (!date) return 'N/A';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  }

  getMonthName(month: number): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1] || 'Unknown';
  }

  getDisplayRange(): string {
    if (this.tenants.length === 0) return '0-0';
    return `${this.filteredTenants.length} of ${this.totalCount}`;
  }

  // ===== NAVIGATION =====

  goBack() {
    if (this.buildingId) {
      this.router.navigate(['/superadmin-panel/buildings', this.buildingId]);
    } else {
      this.router.navigate(['/superadmin-panel']);
    }
  }

  viewTenantDetails(tenantId: string) {
    this.router.navigate(['/superadmin-panel/tenant', tenantId], {
      queryParams: {
        buildingId: this.buildingId,
        buildingName: this.buildingName,
        entryId: this.entryId,
        entryName: this.entryName
      }
    });
  }
}
