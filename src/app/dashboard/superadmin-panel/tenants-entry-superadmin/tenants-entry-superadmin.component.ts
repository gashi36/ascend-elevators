// tenants-superadmin.component.ts
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
  CreateTenantGQL
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
  buildingId: string | null = null;
  entryId: string | null = null;
  tenants: any[] = [];
  filteredTenants: any[] = [];
  isLoading = true;
  isLoadingMore = false;
  error: string | null = null;
  buildingName: string = '';
  entryName: string = '';
  showAddTenantModal = false;
  newTenant = {
    name: '',
    unitNumber: '',
    contactEmail: '',
    contactPhone: ''
  };
  isCreatingTenant = false;

  // Monthly decision
  selectedTenant: any = null;
  showDecisionModal = false;
  decisionStatus: DecisionStatus = DecisionStatus.Pending;
  decisionMonth: number = new Date().getMonth() + 1;
  decisionYear: number = new Date().getFullYear();
  isSavingDecision = false;

  // Current user ID
  currentUserId: string | null = null;

  // Status enum for template
  DecisionStatus = DecisionStatus;

  // Pagination
  pageSize = 30;
  totalCount = 0;
  hasNextPage = false;
  endCursor: string | null = null;
  allLoaded = false; // Track if all data loaded

  // Filtering and sorting
  searchTerm: string = '';
  sortField: 'name' | 'createdAt' | 'unitNumber' = 'name';
  sortDirection: 'ASC' | 'DESC' = 'ASC';
  filterStatus: 'all' | 'pending' | 'allowed' | 'denied' = 'all';

  // Search debounce
  private searchSubject = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenantsByBuildingEntryGQL: TenantsByBuildingEntryGQL,
    private createOrUpdateMonthlyDecisionGQL: CreateOrUpdateMonthlyDecisionGQL,
    private createTenantGQL: CreateTenantGQL,
    private authService: AuthService
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

    this.route.queryParams.subscribe(params => {
      this.buildingId = params['buildingId'] || params['buildingID'] || null;
      this.entryId = params['entryId'] || params['entryID'] || null;
      this.buildingName = params['buildingName'] || '';
      this.entryName = params['entryName'] || '';

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
      paymentStatusDetails: this.getPaymentStatusDetails(currentDecision, isOverdue, daysOverdue, daysUntilNextPayment)
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

  // ===== DATA LOADING =====

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
    this.filteredTenants = [];
    this.endCursor = null;
    this.allLoaded = false;
    this.loadTenants();
  }
  getStatusText(status: DecisionStatus): string {
    switch (status) {
      case DecisionStatus.Allowed:
        return '✅ Allowed';
      case DecisionStatus.Denied:
        return '❌ Denied';
      case DecisionStatus.Pending:
      default:
        return '⏳ Pending';
    }
  }
  loadTenants(cursor: string | null = null, loadMore: boolean = false) {
    if (!loadMore) {
      this.isLoading = true;
    } else {
      this.isLoadingMore = true;
    }

    if (!this.entryId) {
      this.isLoading = false;
      this.isLoadingMore = false;
      this.error = 'Entry ID is missing';
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
      next: (result: any) => {
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

        // Process tenants with payment info
        const processedTenants = rawTenants.map((tenant: any) => this.processTenantPaymentInfo(tenant));

        if (loadMore) {
          this.tenants = [...this.tenants, ...processedTenants];
        } else {
          this.tenants = processedTenants;
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

  loadMore() {
    if (this.hasNextPage && this.endCursor && !this.allLoaded) {
      this.loadTenants(this.endCursor, true);
    }
  }

  refreshTenants() {
    this.resetAndLoadTenants();
  }

  // ===== FILTERING & SORTING =====

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

  onFilterChange() {
    this.applyClientSideFilter();
  }


  openDecisionModal(tenant: any) {
    this.selectedTenant = tenant;
    this.decisionStatus = tenant.currentDecision?.status || DecisionStatus.Pending;
    this.showDecisionModal = true;

    if (tenant.currentDecision) {
      this.decisionMonth = tenant.currentDecision.month;
      this.decisionYear = tenant.currentDecision.year;
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

          this.refreshTenants();
          alert('Payment decision saved successfully!');
          this.closeDecisionModal();
        },
        error: (err: any) => {
          this.isSavingDecision = false;
          this.error = `Failed to save decision: ${err.message}`;
        }
      });
  }

  // ===== HELPER METHODS =====

  isValidUUID(uuid: string | null): boolean {
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
    const displayed = this.filteredTenants.length;
    return `${displayed} of ${this.totalCount}`;
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

  openAddTenantModal() {
    this.showAddTenantModal = true;
    // Reset form
    this.newTenant = {
      name: '',
      unitNumber: '',
      contactEmail: '',
      contactPhone: ''
    };
  }
  closeAddTenantModal() {
    this.showAddTenantModal = false;
    this.isCreatingTenant = false;
    this.error = null;
  }

  createTenant() {
    if (!this.entryId) {
      this.error = 'Entry ID is missing';
      return;
    }

    // Validate required fields
    if (!this.newTenant.name.trim()) {
      this.error = 'Tenant name is required';
      return;
    }

    if (!this.newTenant.unitNumber.trim()) {
      this.error = 'Unit number is required';
      return;
    }

    this.isCreatingTenant = true;
    this.error = null;

    this.createTenantGQL.mutate({
      variables: {
        buildingEntryId: this.entryId,
        name: this.newTenant.name,
        unitNumber: this.newTenant.unitNumber,
        contactEmail: this.newTenant.contactEmail || '',
        contactPhone: this.newTenant.contactPhone || '',
        buildingId: undefined
      }
    }).pipe(take(1)).subscribe({
      next: (result: any) => {
        this.isCreatingTenant = false;

        if (result.errors?.length) {
          this.error = `Error: ${result.errors[0].message}`;
          return;
        }

        const newTenant = result.data?.createTenant;
        if (newTenant) {
          alert(`Tenant "${newTenant.name}" created successfully!`);
          this.closeAddTenantModal();
          this.refreshTenants(); // Reload the tenant list
        }
      },
      error: (err: any) => {
        this.isCreatingTenant = false;
        this.error = `Failed to create tenant: ${err.message}`;
      }
    });
  }
}
