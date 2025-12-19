import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';

// GraphQL imports
import {
  GetAllTenantsGQL,
  CreateOrUpdateMonthlyDecisionGQL,
  CreateTenantGQL,
  TenantSortInput,
  DecisionStatus,
  CreateMonthlyDecisionInput
} from '../../../../graphql/generated/graphql';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss']
})
export class TenantsComponent implements OnInit {
  tenants: any[] = [];
  processedTenants: any[] = [];
  isLoading = true;
  isLoadingMore = false;
  error: string | null = null;

  // Monthly decision modal
  selectedTenant: any = null;
  showDecisionModal = false;
  decisionStatus: DecisionStatus = DecisionStatus.Pending;
  decisionMonth: number = new Date().getMonth() + 1;
  decisionYear: number = new Date().getFullYear();
  isSavingDecision = false;

  // Create tenant modal
  showCreateTenantModal = false;
  isCreatingTenant = false;
  newTenant = {
    buildingEntryId: '',
    buildingId: '',
    contactEmail: '',
    contactPhone: '',
    name: '',
    unitNumber: ''
  };
  buildings: any[] = [];

  // Current user ID
  currentUserId: string | null = null;

  // Status enum for template
  DecisionStatus = DecisionStatus;

  // Pagination
  pageSize = 30;
  totalCount = 0;
  hasNextPage = false;
  endCursor: string | null = null;
  allLoaded = false;

  // Filtering and sorting
  searchTerm = '';
  sortField: 'name' | 'createdAt' | 'unitNumber' = 'name';
  sortDirection: 'ASC' | 'DESC' = 'ASC';
  filterStatus: 'all' | 'pending' | 'allowed' | 'denied' = 'all';

  // Search debounce
  private searchSubject = new Subject<string>();
  getBuildingsGQL: any;

  constructor(
    private getAllTenantsGQL: GetAllTenantsGQL,
    private createOrUpdateMonthlyDecisionGQL: CreateOrUpdateMonthlyDecisionGQL,
    private createTenantGQL: CreateTenantGQL
  ) { }

  ngOnInit() {
    this.extractUserIdFromToken();

    // Setup search debounce
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.resetAndLoadTenants();
    });

    this.loadTenants();
    this.loadBuildings();
  }

  private extractUserIdFromToken(): void {
    const token = localStorage.getItem('jwt_token');
    if (!token) return;

    try {
      const payload = this.decodeToken(token);
      this.currentUserId = payload?.nameid || payload?.sub || payload?.userId || payload?.id;
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  resetAndLoadTenants() {
    this.tenants = [];
    this.processedTenants = [];
    this.endCursor = null;
    this.allLoaded = false;
    this.loadTenants();
  }

  loadTenants(cursor: string | null = null, loadMore: boolean = false) {
    if (!loadMore) {
      this.isLoading = true;
    } else {
      this.isLoadingMore = true;
    }

    // Prepare order
    const order: TenantSortInput[] = this.sortField ?
      [{ [this.sortField]: this.sortDirection }] : [];

    this.getAllTenantsGQL.fetch({
      variables: {
        first: this.pageSize,
        after: cursor,
        search: this.searchTerm || '',
        order: order
      },
      fetchPolicy: 'network-only'
    }).subscribe({
      next: (result: any) => {
        this.isLoading = false;
        this.isLoadingMore = false;

        if (result.errors?.length) {
          this.error = `GraphQL Error: ${result.errors[0].message}`;
          return;
        }

        const response = result.data?.tenants;
        if (!response) {
          this.error = 'No data returned';
          return;
        }

        const rawTenants = response?.nodes || [];

        // Update pagination
        this.totalCount = response?.totalCount || 0;
        this.hasNextPage = response?.pageInfo?.hasNextPage || false;
        this.endCursor = response?.pageInfo?.endCursor || null;

        // Process tenants with payment info
        const processedTenants = rawTenants.map((tenant: any) =>
          this.processTenantPaymentInfo(tenant)
        );

        if (loadMore) {
          this.tenants = [...this.tenants, ...rawTenants];
          this.processedTenants = [...this.processedTenants, ...processedTenants];
        } else {
          this.tenants = rawTenants;
          this.processedTenants = processedTenants;
        }

        // Apply client-side filter
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
      },
      error: (err: any) => {
        this.isLoading = false;
        this.isLoadingMore = false;
        this.error = `Failed to load tenants: ${err.message}`;
      }
    });
  }

  // ===== CREATE TENANT METHODS =====

  openCreateTenantModal() {
    this.showCreateTenantModal = true;
    this.resetNewTenantForm();
  }

  closeCreateTenantModal() {
    this.showCreateTenantModal = false;
    this.resetNewTenantForm();
    this.isCreatingTenant = false;
  }

  resetNewTenantForm() {
    this.newTenant = {
      buildingEntryId: '',
      buildingId: '',
      contactEmail: '',
      contactPhone: '',
      name: '',
      unitNumber: ''
    };
  }

  loadBuildings() {
    // This should load available buildings for the dropdown
    // You'll need to implement this based on your GraphQL schema
    // For example, you might have a GetBuildingsGQL service
    // For now, I'll leave this as a placeholder
    this.buildings = [];

    this.getBuildingsGQL.fetch().subscribe({
      next: (result: any) => {
        this.buildings = result.data?.buildings?.nodes || [];
      },
      error: (err: any) => {
        console.error('Failed to load buildings:', err);
      }
    });
  }

  validateTenantForm(): boolean {
    if (!this.newTenant.buildingEntryId) {
      this.error = 'Please select a building';
      return false;
    }

    if (!this.newTenant.name?.trim()) {
      this.error = 'Please enter tenant name';
      return false;
    }

    if (!this.newTenant.contactEmail?.trim()) {
      this.error = 'Please enter contact email';
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newTenant.contactEmail)) {
      this.error = 'Please enter a valid email address';
      return false;
    }

    if (!this.newTenant.contactPhone?.trim()) {
      this.error = 'Please enter contact phone';
      return false;
    }

    if (!this.newTenant.unitNumber?.trim()) {
      this.error = 'Please enter unit number';
      return false;
    }

    return true;
  }

  createTenant() {
    // Validate form
    if (!this.validateTenantForm()) {
      return;
    }

    this.isCreatingTenant = true;
    this.error = null;

    this.createTenantGQL.mutate({
      variables: {
        buildingEntryId: this.newTenant.buildingEntryId,
        contactEmail: this.newTenant.contactEmail,
        contactPhone: this.newTenant.contactPhone,
        name: this.newTenant.name,
        unitNumber: this.newTenant.unitNumber,
        buildingId: undefined
      }
    }).subscribe({
      next: (result: any) => {
        this.isCreatingTenant = false;

        if (result.errors?.length) {
          this.error = `Error creating tenant: ${result.errors[0].message}`;
          return;
        }

        // Success
        alert('Tenant created successfully!');
        this.closeCreateTenantModal();
        this.resetAndLoadTenants(); // Refresh the list
      },
      error: (err: any) => {
        this.isCreatingTenant = false;
        this.error = `Failed to create tenant: ${err.message}`;
      }
    });
  }

  // ===== MONTHLY DECISION METHODS =====

  openDecisionModal(tenant: any) {
    this.selectedTenant = tenant;
    this.decisionStatus = tenant.currentDecision?.status || DecisionStatus.Pending;
    this.showDecisionModal = true;

    if (tenant.currentDecision) {
      this.decisionMonth = tenant.currentDecision.month;
      this.decisionYear = tenant.currentDecision.year;
    } else {
      const today = new Date();
      this.decisionMonth = today.getMonth() + 1;
      this.decisionYear = today.getFullYear();
    }

    if (!this.currentUserId) {
      this.extractUserIdFromToken();
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
      this.extractUserIdFromToken();
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
        next: (result: any) => {
          this.isSavingDecision = false;

          if (result.errors?.length) {
            this.error = `Error: ${result.errors[0].message}`;
            return;
          }

          this.resetAndLoadTenants();
          alert('Payment decision saved successfully!');
          this.closeDecisionModal();
        },
        error: (err: any) => {
          this.isSavingDecision = false;
          this.error = `Failed to save decision: ${err.message}`;
        }
      });
  }

  // ===== PAYMENT & DECISION TRACKING =====

  private processTenantPaymentInfo(tenant: any): any {
    const currentDecision = tenant.monthlyDecisions?.find((d: any) =>
      d.year === new Date().getFullYear() &&
      d.month === new Date().getMonth() + 1
    );

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Calculate payment due date based on RentDueDayOfMonth (default 1st)
    const dueDay = tenant.rentDueDayOfMonth || 1;
    const paymentDueDate = new Date(currentYear, currentMonth, dueDay);

    // If due date has passed this month, check overdue status
    const daysUntilDue = this.calculateDaysUntil(paymentDueDate, today);
    const isOverdue = daysUntilDue < 0 && (!currentDecision || currentDecision.status === DecisionStatus.Pending);
    const daysOverdue = isOverdue ? Math.abs(daysUntilDue) : 0;

    // Calculate next payment date (if overdue, it's this month's due date, otherwise next month)
    const nextPaymentDate = isOverdue ? paymentDueDate : new Date(currentYear, currentMonth + 1, dueDay);
    const daysUntilNextPayment = this.calculateDaysUntil(nextPaymentDate, today);

    return {
      ...tenant,
      // Format dates
      formattedLeaseEnd: this.formatDate(tenant.leaseEndDate),
      formattedLastPayment: this.formatDate(tenant.lastPaymentDate),
      formattedLeaseStart: this.formatDate(tenant.leaseStartDate),
      formattedCreatedAt: this.formatDate(tenant.createdAt),
      formattedMonthlyRent: tenant.monthlyRent ? `$${tenant.monthlyRent.toFixed(2)}` : 'N/A',

      // Payment info
      currentDecision: currentDecision,
      paymentDueDate: paymentDueDate,
      formattedPaymentDue: this.formatDate(paymentDueDate.toISOString()),
      daysUntilDue: daysUntilDue,
      isPaymentOverdue: isOverdue,
      daysOverdue: daysOverdue,
      nextPaymentDate: nextPaymentDate,
      daysUntilNextPayment: daysUntilNextPayment,

      // Status display
      statusClass: this.getPaymentStatusClass(currentDecision?.status || DecisionStatus.Pending, isOverdue),
      statusText: this.getPaymentStatusText(currentDecision?.status || DecisionStatus.Pending, isOverdue),
      paymentStatusDetails: this.getPaymentStatusDetails(currentDecision, isOverdue, daysOverdue, daysUntilNextPayment),

      // Building info (from updated query)
      building: tenant.buildingEntry?.building,
      buildingEntry: {
        id: tenant.buildingEntry?.id,
        name: tenant.buildingEntry?.name,
        createdAt: tenant.buildingEntry?.createdAt
      },

      // Administrator info
      administrators: tenant.buildingEntry?.building?.administrators || []
    };
  }

  private calculateDaysUntil(targetDate: Date, fromDate: Date): number {
    const timeDiff = targetDate.getTime() - fromDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  getPaymentStatusClass(status: DecisionStatus, isOverdue: boolean): string {
    if (status === DecisionStatus.Allowed) return 'payment-status-allowed';
    if (status === DecisionStatus.Denied) return 'payment-status-denied';
    if (isOverdue) return 'payment-status-overdue';
    return 'payment-status-pending';
  }

  getPaymentStatusText(status: DecisionStatus, isOverdue: boolean): string {
    if (status === DecisionStatus.Allowed) return '✅ Allowed';
    if (status === DecisionStatus.Denied) return '❌ Denied';
    if (isOverdue) return '⚠️ Overdue';
    return '⏳ Pending';
  }

  getPaymentStatusDetails(decision: any, isOverdue: boolean, daysOverdue: number, daysUntilNext: number): string {
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

  applyClientSideFilter() {
    if (this.filterStatus === 'all') {
      this.processedTenants = [...this.tenants.map(t => this.processTenantPaymentInfo(t))];
    } else {
      let statusToMatch: DecisionStatus;
      switch (this.filterStatus) {
        case 'allowed': statusToMatch = DecisionStatus.Allowed; break;
        case 'denied': statusToMatch = DecisionStatus.Denied; break;
        default: statusToMatch = DecisionStatus.Pending;
      }

      this.processedTenants = this.tenants
        .map(t => this.processTenantPaymentInfo(t))
        .filter(tenant => {
          const status = tenant.currentDecision?.status || DecisionStatus.Pending;
          return status === statusToMatch;
        });
    }
  }

  onFilterChange() {
    this.applyClientSideFilter();
  }

  // ===== HELPER METHODS =====

  getDisplayRange(): string {
    if (this.processedTenants.length === 0) return '0-0';
    return `${this.processedTenants.length} of ${this.totalCount}`;
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

  loadMore() {
    if (this.hasNextPage && this.endCursor && !this.allLoaded) {
      this.loadTenants(this.endCursor, true);
    }
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
    this.filterStatus = 'all'; // Reset the filter status
    this.sortField = 'name'; // Optional: reset sort if desired
    this.sortDirection = 'ASC'; // Optional: reset sort direction

    this.resetAndLoadTenants();
  }

  viewTenantDetails(tenantId: string) {
    // Implement navigation to tenant details
    console.log('View tenant details:', tenantId);
  }

  refreshTenants() {
    this.resetAndLoadTenants();
  }

  // New methods for building/administrator info
  getBuildingName(tenant: any): string {
    return tenant.building?.name || 'N/A';
  }

  getBuildingAddress(tenant: any): string {
    return tenant.building?.address || 'No address';
  }

  getCityInfo(tenant: any): string {
    const city = tenant.building?.city;
    return city ? `${city.name} (${city.code})` : 'N/A';
  }

  getAdministratorNames(tenant: any): string {
    if (!tenant.administrators || tenant.administrators.length === 0) {
      return 'No administrators';
    }
    return tenant.administrators
      .map((admin: any) => `${admin.firstName} ${admin.lastName}`)
      .join(', ');
  }

  getAdministratorCount(tenant: any): number {
    return tenant.administrators?.length || 0;
  }
}
