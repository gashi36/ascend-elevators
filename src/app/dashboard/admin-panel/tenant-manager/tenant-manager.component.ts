// import { Component, OnInit, OnDestroy, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Subject, debounceTime, distinctUntilChanged, takeUntil, forkJoin } from 'rxjs';
// import {
//   TenantSortInput,
//   DecisionStatus,
//   GetTenantsGQL,
//   SetMonthlyStatusesGQL,
//   UpdateTenantGQL,
//   DeleteTenantGQL,
//   CreateTenantGQL,
//   GetBuildingsGQL,
//   GetBuildingEntriesGQL,
//   TenantFilterInput,
//   SortEnumType
// } from '../../../../graphql/generated/graphql';

// export type TenantContext = 'all' | 'building' | 'entry';

// @Component({
//   selector: 'app-tenant-manager',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './tenant-manager.component.html',
//   styleUrls: ['./tenant-manager.component.scss']
// })
// export class TenantManagerComponent implements OnInit, OnDestroy {
//   @Input() context: TenantContext = 'all';
//   @Input() buildingId?: string;
//   @Input() entryId?: string;

//   // Data
//   tenants: any[] = [];
//   buildings: any[] = [];
//   buildingEntries: any[] = [];
//   filteredBuildingEntries: any[] = [];
//   loading = false;
//   initialLoadComplete = false; // Track if initial load is done

//   // UI States
//   showModal = false;
//   showCreateModal = false;
//   activeActionsMenu: string | null = null;
//   savingTenant = false;
//   buildingFilter = 'all';

//   // Notifications
//   toast = {
//     message: '',
//     type: 'success' as 'success' | 'error' | 'warning',
//     show: false,
//     timeoutId: null as any
//   };

//   confirmDialog = {
//     show: false,
//     title: '',
//     message: '',
//     action: () => { },
//     actionLabel: 'Confirm'
//   };

//   // Paging
//   pageSize = 15;
//   currentPage = 1;
//   endCursor: string | null = null;
//   hasNextPage = false;
//   totalAllowed = 0;
//   totalDenied = 0;
//   totalCount = 0;

//   // Filters & Search
//   searchTerm = '';

//   // Sorting
//   sortField: keyof TenantSortInput = 'floor';
//   sortDirection: SortEnumType = SortEnumType.Asc;

//   // ===== MONTHLY STATUS STATE =====
//   DecisionStatus = DecisionStatus;
//   selectedTenant: any = null;
//   selectedMonths: { [year: number]: number[] } = {};
//   selectedStatus: DecisionStatus = DecisionStatus.Allowed;
//   selectedYear = new Date().getFullYear();
//   decisionNotes = '';

//   // ===== TENANT EDIT/CREATE =====
//   editingTenant: any = null;
//   newTenant = {
//     name: '',
//     unitNumber: '',
//     floor: '',
//     contactEmail: '',
//     contactPhone: '',
//     accessKeyNR: '',
//     buildingId: '',
//     buildingEntryId: ''
//   };

//   // ===== YEARS & MONTHS =====
//   availableYears: number[] = [];
//   currentMonth = new Date().getMonth() + 1;
//   currentYear = new Date().getFullYear();

//   readonly months = [
//     { value: 1, label: 'Jan' }, { value: 2, label: 'Feb' },
//     { value: 3, label: 'Mar' }, { value: 4, label: 'Apr' },
//     { value: 5, label: 'May' }, { value: 6, label: 'Jun' },
//     { value: 7, label: 'Jul' }, { value: 8, label: 'Aug' },
//     { value: 9, label: 'Sep' }, { value: 10, label: 'Oct' },
//     { value: 11, label: 'Nov' }, { value: 12, label: 'Dec' }
//   ];

//   private search$ = new Subject<string>();
//   private destroy$ = new Subject<void>();

//   constructor(
//     private getTenantsGQL: GetTenantsGQL,
//     private setMonthlyStatusGQL: SetMonthlyStatusesGQL,
//     private updateTenantGQL: UpdateTenantGQL,
//     private deleteTenantGQL: DeleteTenantGQL,
//     private createTenantGQL: CreateTenantGQL,
//     private getBuildingsGQL: GetBuildingsGQL,
//     private getBuildingEntriesGQL: GetBuildingEntriesGQL
//   ) { }

//   ngOnInit(): void {
//     this.generateYears();
//     this.setupSearch();

//     // Load all data in parallel
//     forkJoin({
//       buildings: this.loadBuildings(),
//       entries: this.loadBuildingEntries()
//     }).pipe(takeUntil(this.destroy$)).subscribe({
//       next: () => {
//         this.initializeContextSelections();
//         this.loadTenants(); // Load tenants after all data is ready
//         this.initialLoadComplete = true;
//       },
//       error: (error) => {
//         this.showToast('Dështoi ngarkimi i të dhënave', 'error');
//       }
//     });
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//     if (this.toast.timeoutId) clearTimeout(this.toast.timeoutId);
//   }

//   // ================= YEAR GENERATION =================
//   generateYears(): void {
//     const current = new Date().getFullYear();
//     this.availableYears = [current - 1, current, current + 1];
//     this.selectedYear = current;
//   }

//   previousYear(): void {
//     const currentIndex = this.availableYears.indexOf(this.selectedYear);
//     if (currentIndex > 0) {
//       this.selectedYear = this.availableYears[currentIndex - 1];
//       this.calculateTotalStats();
//       if (this.showModal) {
//         this.updateSelectedMonthsForYear();
//       }
//     }
//   }

//   nextYear(): void {
//     const currentIndex = this.availableYears.indexOf(this.selectedYear);
//     if (currentIndex < this.availableYears.length - 1) {
//       this.selectedYear = this.availableYears[currentIndex + 1];
//       this.calculateTotalStats();
//       if (this.showModal) {
//         this.updateSelectedMonthsForYear();
//       }
//     }
//   }

//   private updateSelectedMonthsForYear(): void {
//     if (!this.selectedMonths[this.selectedYear]) {
//       this.selectedMonths[this.selectedYear] = [];
//     }
//   }

//   // ================= SEARCH & FILTER =================
//   setupSearch(): void {
//     this.search$.pipe(
//       debounceTime(300),
//       distinctUntilChanged(),
//       takeUntil(this.destroy$)
//     ).subscribe(() => this.loadTenants(true));
//   }

//   onSearchInput(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     this.searchTerm = input.value;
//     this.search$.next(this.searchTerm);
//   }

//   clearSearch(): void {
//     this.searchTerm = '';
//     this.loadTenants(true);
//   }

//   // ================= SORTING =================
//   changeSort(field: keyof TenantSortInput): void {
//     if (this.sortField === field) {
//       this.toggleSortDirection();
//     } else {
//       this.sortField = field;
//       this.sortDirection = SortEnumType.Asc;
//       this.loadTenants(true);
//     }
//   }

//   toggleSortDirection(): void {
//     this.sortDirection = this.sortDirection === SortEnumType.Asc ? SortEnumType.Desc : SortEnumType.Asc;
//     this.loadTenants(true);
//   }

//   // Sort tenants by floor numerically
//   sortTenantsByFloor(tenants: any[], direction: SortEnumType): any[] {
//     return [...tenants].sort((a, b) => {
//       const floorA = parseInt(a.floor) || 0;
//       const floorB = parseInt(b.floor) || 0;

//       if (direction === SortEnumType.Asc) {
//         return floorA - floorB;
//       } else {
//         return floorB - floorA;
//       }
//     });
//   }

//   // ================= DATA LOADING =================
//   loadBuildings(): Promise<any> {
//     return new Promise((resolve, reject) => {
//       this.getBuildingsGQL.watch({
//         variables: {
//           first: 100,
//           order: [{ name: SortEnumType.Asc }]
//         }
//       })
//         .valueChanges
//         .pipe(takeUntil(this.destroy$))
//         .subscribe({
//           next: (res: any) => {
//             this.buildings = res.data?.buildings?.nodes || [];
//             resolve(this.buildings);
//           },
//           error: (error) => {
//             this.showToast('Dështoi në ngarkimin e ndërtesave', 'error');
//             reject(error);
//           }
//         });
//     });
//   }

//   loadBuildingEntries(): Promise<any> {
//     return new Promise((resolve, reject) => {
//       this.getBuildingEntriesGQL.watch({
//         variables: {
//           first: 100,
//           order: [{ name: SortEnumType.Asc }]
//         }
//       })
//         .valueChanges
//         .pipe(takeUntil(this.destroy$))
//         .subscribe({
//           next: (res: any) => {
//             this.buildingEntries = res.data?.buildingEntries?.nodes || [];
//             resolve(this.buildingEntries);
//           },
//           error: (error) => {
//             this.showToast('Dështoi në ngarkimin e hyrjeve', 'error');
//             reject(error);
//           }
//         });
//     });
//   }

//   private initializeContextSelections(): void {
//     // Auto-select based on context
//     if (this.context === 'building' && this.buildingId) {
//       this.newTenant.buildingId = this.buildingId;
//       this.buildingFilter = this.buildingId;
//       this.filterBuildingEntries();
//     } else if (this.context === 'entry' && this.entryId) {
//       this.newTenant.buildingEntryId = this.entryId;
//       const entry = this.buildingEntries.find((e: any) => e.id === this.entryId);
//       if (entry) {
//         this.newTenant.buildingId = entry.buildingId;
//         this.buildingFilter = entry.buildingId;
//         this.filterBuildingEntries();
//       }
//     }
//   }

//   private filterBuildingEntries(): void {
//     if (this.newTenant.buildingId) {
//       this.filteredBuildingEntries = this.buildingEntries.filter(
//         (entry: any) => entry.buildingId === this.newTenant.buildingId
//       );
//     } else {
//       this.filteredBuildingEntries = [];
//     }
//   }

//   loadTenants(reset = false): void {
//     if (this.loading) return;

//     if (reset) {
//       this.currentPage = 1;
//       this.endCursor = null;
//     }

//     this.loading = true;

//     const where: TenantFilterInput = this.buildWhereFilter();
//     const order: TenantSortInput[] = [{ [this.sortField]: this.sortDirection }] as TenantSortInput[];

//     this.getTenantsGQL.watch({
//       variables: {
//         where,
//         order,
//         first: this.pageSize,
//         after: this.endCursor
//       }
//     })
//       .valueChanges
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (res: any) => {
//           const data = res.data?.tenants;
//           let loadedTenants = data?.nodes || [];

//           // If sorting by floor, do numerical sort
//           if (this.sortField === 'floor') {
//             loadedTenants = this.sortTenantsByFloor(loadedTenants, this.sortDirection);
//           }

//           this.tenants = loadedTenants;
//           this.totalCount = data?.totalCount ?? 0;
//           this.hasNextPage = data?.pageInfo?.hasNextPage ?? false;
//           this.endCursor = data?.pageInfo?.endCursor ?? null;
//           this.loading = false;
//           this.calculateTotalStats();
//         },
//         error: (error: any) => {
//           this.loading = false;
//           this.showToast(`Dështoi në ngarkimin e qiramarrësve: ${error.message}`, 'error');
//         }
//       });
//   }

//   private buildWhereFilter(): TenantFilterInput {
//     const where: TenantFilterInput = {};

//     // Context filters
//     if (this.context === 'building' && this.buildingId) {
//       where.buildingId = { eq: this.buildingId };
//     } else if (this.context === 'entry' && this.entryId) {
//       where.buildingEntryId = { eq: this.entryId };
//     } else if (this.buildingFilter !== 'all') {
//       where.buildingId = { eq: this.buildingFilter };
//     }

//     // Search filter
//     if (this.searchTerm.trim()) {
//       where.or = [
//         { name: { contains: this.searchTerm } },
//         { contactEmail: { contains: this.searchTerm } },
//         { contactPhone: { contains: this.searchTerm } },
//         { accessKeyNR: { contains: this.searchTerm } },
//         { unitNumber: { contains: this.searchTerm } }
//       ];
//     }

//     return where;
//   }

//   // ================= STATISTICS =================
//   calculateTotalStats(): void {
//     this.totalAllowed = 0;
//     this.totalDenied = 0;

//     this.tenants.forEach(tenant => {
//       this.totalAllowed += this.getAllowedCount(tenant);
//       this.totalDenied += this.getDeniedCount(tenant);
//     });
//   }

//   getAllowedCount(tenant: any): number {
//     return this.getMonthlyCount(tenant, DecisionStatus.Allowed);
//   }

//   getDeniedCount(tenant: any): number {
//     return this.getMonthlyCount(tenant, DecisionStatus.Denied);
//   }

//   getPendingCount(tenant: any): number {
//     return 12 - this.getAllowedCount(tenant) - this.getDeniedCount(tenant);
//   }

//   private getMonthlyCount(tenant: any, status: DecisionStatus): number {
//     if (!tenant.monthlyDecisions || !Array.isArray(tenant.monthlyDecisions)) {
//       return 0;
//     }

//     return tenant.monthlyDecisions.filter((d: any) =>
//       d.year === this.selectedYear && d.status === status
//     ).length;
//   }

//   getDecisionStatusForMonth(tenant: any, month: number): DecisionStatus {
//     if (!tenant.monthlyDecisions || !Array.isArray(tenant.monthlyDecisions)) {
//       return DecisionStatus.Pending;
//     }

//     const decision = tenant.monthlyDecisions.find((d: any) =>
//       d.month === month && d.year === this.selectedYear
//     );
//     return decision?.status || DecisionStatus.Pending;
//   }

//   // ================= MONTH MANAGEMENT =================
//   openTenantModal(tenant: any, event?: Event): void {
//     if (event) event.stopPropagation();
//     this.selectedTenant = tenant;
//     this.selectedMonths = {};
//     this.selectedStatus = DecisionStatus.Allowed;
//     this.decisionNotes = this.getLastNote(tenant) || '';
//     this.selectedYear = new Date().getFullYear();
//     this.showModal = true;
//     this.activeActionsMenu = null;
//   }

//   toggleMonthSelection(month: number): void {
//     if (!this.selectedTenant) return;

//     const currentStatus = this.getDecisionStatusForMonth(this.selectedTenant, month);

//     if (currentStatus !== DecisionStatus.Pending) {
//       const statusText = currentStatus === DecisionStatus.Allowed ? 'Paguar' : 'Borxh';
//       this.showConfirm(
//         'Rivendos Vendimin',
//         `Ky muaj ka akses të vendosur paraprakisht si "${statusText}".\nA jeni i sigurt që dëshironi të rivendosni aksesin?`,
//         () => {
//           this.proceedToggleMonthSelection(month);
//         },
//         'Po, Rivendos'
//       );
//     } else {
//       this.proceedToggleMonthSelection(month);
//     }
//   }

//   private proceedToggleMonthSelection(month: number): void {
//     if (!this.selectedMonths[this.selectedYear]) {
//       this.selectedMonths[this.selectedYear] = [];
//     }

//     const index = this.selectedMonths[this.selectedYear].indexOf(month);
//     if (index > -1) {
//       this.selectedMonths[this.selectedYear].splice(index, 1);
//     } else {
//       this.selectedMonths[this.selectedYear].push(month);
//     }
//   }

//   selectAllMonths(): void {
//     this.selectedMonths[this.selectedYear] = this.months.map(m => m.value);
//   }

//   clearMonthSelection(): void {
//     this.selectedMonths[this.selectedYear] = [];
//   }

//   selectCurrentMonth(): void {
//     if (!this.selectedMonths[this.selectedYear]) {
//       this.selectedMonths[this.selectedYear] = [];
//     }

//     if (this.selectedYear === this.currentYear) {
//       const index = this.selectedMonths[this.selectedYear].indexOf(this.currentMonth);
//       if (index > -1) {
//         this.selectedMonths[this.selectedYear].splice(index, 1);
//         this.showToast(`Muaji aktual është hequr nga zgjedhja`, 'warning');
//       } else {
//         this.selectedMonths[this.selectedYear] = [this.currentMonth];
//         this.showToast(`Muaji aktual është zgjedhur`, 'success');
//       }
//     } else {
//       this.selectedMonths[this.selectedYear] = [this.currentMonth];
//       this.showToast(`Muaji ${this.getMonthName(this.currentMonth)} i vitit ${this.selectedYear} është zgjedhur`, 'success');
//     }
//   }

//   isCurrentMonth(month: number): boolean {
//     return this.currentYear === this.selectedYear && this.currentMonth === month;
//   }

//   isMonthSelected(month: number): boolean {
//     return this.selectedMonths[this.selectedYear]?.includes(month) || false;
//   }

//   setSelectedStatus(status: DecisionStatus): void {
//     this.selectedStatus = status;
//   }

//   getMonthCardClass(month: number): string {
//     const isSelected = this.isMonthSelected(month);
//     const currentStatus = this.getDecisionStatusForMonth(this.selectedTenant, month);

//     const baseClasses = 'p-3 sm:p-4 rounded-xl border-2 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-md';

//     if (isSelected) {
//       if (this.selectedStatus === DecisionStatus.Allowed) {
//         return `${baseClasses} border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-sm`;
//       } else if (this.selectedStatus === DecisionStatus.Denied) {
//         return `${baseClasses} border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-sm`;
//       }
//     }

//     switch (currentStatus) {
//       case DecisionStatus.Allowed:
//         return `${baseClasses} border-green-300 bg-gradient-to-br from-green-50 to-green-50/70`;
//       case DecisionStatus.Denied:
//         return `${baseClasses} border-red-300 bg-gradient-to-br from-red-50 to-red-50/70`;
//       case DecisionStatus.Pending:
//         return `${baseClasses} border-orange-300 bg-gradient-to-br from-orange-50 to-orange-50/70`;
//       default:
//         return `${baseClasses} border-gray-200 bg-gradient-to-br from-gray-50 to-white`;
//     }
//   }

//   getMonthStatusText(month: number): string {
//     const status = this.getDecisionStatusForMonth(this.selectedTenant, month);

//     switch (status) {
//       case DecisionStatus.Allowed:
//         return 'Paguar';
//       case DecisionStatus.Denied:
//         return 'Borxh';
//       case DecisionStatus.Pending:
//         return 'Pritje';
//       default:
//         return 'Pritje';
//     }
//   }

//   getMonthName(month: number): string {
//     const monthNames = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
//       'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'];
//     return monthNames[month - 1] || '';
//   }

//   getSelectedMonthsCount(): number {
//     return this.selectedMonths[this.selectedYear]?.length || 0;
//   }

//   saveDecisions(): void {
//     const allInputs: any[] = [];

//     Object.keys(this.selectedMonths).forEach(yearStr => {
//       const year = parseInt(yearStr);
//       const months = this.selectedMonths[year] || [];

//       months.forEach(month => {
//         allInputs.push({
//           tenantId: this.selectedTenant.id,
//           month,
//           year,
//           status: this.selectedStatus,
//           notes: this.decisionNotes?.trim() || '',
//           decisionDate: new Date().toISOString()
//         });
//       });
//     });

//     if (allInputs.length === 0) {
//       this.showToast('Ju lutem zgjidhni muaj dhe caktoni statusin e aksesit', 'warning');
//       return;
//     }

//     const selectedStatus = this.selectedStatus;
//     const totalMonths = allInputs.length;
//     const selectedYears = Object.keys(this.selectedMonths);
//     const yearsCount = selectedYears.length;

//     let confirmationMessage: string;

//     if (yearsCount === 1) {
//       const year = selectedYears[0];
//       confirmationMessage = `Cakto aksesin si ${selectedStatus === DecisionStatus.Allowed ? '"Paguar"' : '"Borxh"'} për ${totalMonths} muaj në vitin ${year}?`;
//     } else {
//       const yearsList = selectedYears.join(', ');
//       confirmationMessage = `Cakto aksesin si ${selectedStatus === DecisionStatus.Allowed ? '"Paguar"' : '"Borxh"'} për ${totalMonths} muaj në ${yearsCount} vite të ndryshme (${yearsList})?`;
//     }

//     this.showConfirm(
//       'Cakto Vendimet e Aksesit',
//       confirmationMessage,
//       () => {
//         this.setMonthlyStatusGQL.mutate({
//           variables: {
//             inputs: allInputs
//           }
//         }).subscribe({
//           next: () => {
//             this.closeModal();
//             this.loadTenants(true);

//             let successMessage: string;
//             if (yearsCount === 1) {
//               successMessage = `Aksesi u përditësua për ${totalMonths} muaj në vitin ${selectedYears[0]}`;
//             } else {
//               successMessage = `Aksesi u përditësua për ${totalMonths} muaj në ${yearsCount} vite të ndryshme`;
//             }

//             this.showToast(successMessage);
//           },
//           error: (error: any) => {
//             console.error('Save decisions error:', error);
//             this.showToast(`Përditësimi dështoi: ${error.message}`, 'error');
//           }
//         });
//       }
//     );
//   }

//   closeModal(): void {
//     this.showModal = false;
//     this.selectedTenant = null;
//     this.selectedMonths = {};
//     this.decisionNotes = '';
//   }

//   // ================= TENANT MANAGEMENT =================
//   openCreateTenantModal(): void {
//     this.editingTenant = null;
//     this.resetNewTenant();
//     this.initializeContextSelections();
//     this.showCreateModal = true;
//   }

//   openEditTenantModal(tenant: any): void {
//     this.editingTenant = tenant;
//     this.newTenant = {
//       name: tenant.name || '',
//       unitNumber: tenant.unitNumber || '',
//       floor: tenant.floor || '',
//       contactEmail: tenant.contactEmail || '',
//       contactPhone: tenant.contactPhone || '',
//       accessKeyNR: tenant.accessKeyNR || '',
//       buildingId: tenant.building?.id || '',
//       buildingEntryId: tenant.buildingEntry?.id || ''
//     };
//     this.filterBuildingEntries();
//     this.showCreateModal = true;
//     this.activeActionsMenu = null;
//   }

//   saveTenant(): void {
//     if (this.savingTenant || !this.validateTenant()) return;

//     this.savingTenant = true;
//     const input = this.prepareTenantInput();

//     if (this.editingTenant) {
//       this.updateTenantGQL.mutate({
//         variables: {
//           input: {
//             id: this.editingTenant.id,
//             ...input
//           }
//         }
//       }).subscribe({
//         next: () => {
//           this.savingTenant = false;
//           this.closeCreateModal();
//           this.loadTenants(true);
//           this.showToast('Banori u përditësua me sukses!');
//         },
//         error: (error: any) => {
//           this.savingTenant = false;
//           this.showToast(`Përditësimi dështoi: ${error.message}`, 'error');
//         }
//       });
//     } else {
//       this.createTenantGQL.mutate({
//         variables: {
//           input: input
//         }
//       }).subscribe({
//         next: () => {
//           this.savingTenant = false;
//           this.closeCreateModal();
//           this.loadTenants(true);
//           this.showToast('Banori u krijua me sukses!');
//         },
//         error: (error: any) => {
//           this.savingTenant = false;
//           this.showToast(`Krijimi dështoi: ${error.message}`, 'error');
//         }
//       });
//     }
//   }

//   deleteTenant(tenant: any): void {
//     this.showConfirm(
//       'Fshi Banorin',
//       `Fshi "${tenant.name}"? Kjo veprim nuk mund të zhbëhet.`,
//       () => {
//         this.deleteTenantGQL.mutate({
//           variables: {
//             id: tenant.id
//           }
//         }).subscribe({
//           next: () => {
//             this.loadTenants(true);
//             this.showToast('Banori u fshi me sukses');
//           },
//           error: (error: any) => this.showToast(`Fshirja dështoi: ${error.message}`, 'error')
//         });
//       },
//       'Fshi'
//     );
//   }

//   private prepareTenantInput(): any {
//     return {
//       name: this.newTenant.name.trim(),
//       unitNumber: this.newTenant.unitNumber?.trim() || '',
//       floor: this.newTenant.floor?.trim() || '',
//       contactEmail: this.newTenant.contactEmail?.trim() || '',
//       contactPhone: this.newTenant.contactPhone.trim(),
//       accessKeyNR: this.newTenant.accessKeyNR.trim(),
//       buildingId: this.newTenant.buildingId,
//       buildingEntryId: this.newTenant.buildingEntryId
//     };
//   }

//   private validateTenant(): boolean {
//     const errors = [];
//     if (!this.newTenant.name?.trim()) errors.push('emrin e Banorit');
//     if (!this.newTenant.contactPhone?.trim()) errors.push('numrin e telefonit');
//     if (!this.newTenant.accessKeyNR?.trim()) errors.push('çelësin e aksesit');

//     if (this.context !== 'building' && !this.newTenant.buildingId) {
//       errors.push('ndërtesën');
//     }

//     if (this.newTenant.buildingId && !this.newTenant.buildingEntryId) {
//       errors.push('hyrjen e ndërtesës');
//     }

//     if (errors.length) {
//       this.showToast(`Ju lutem plotësoni ${errors.join(', ')}`, 'warning');
//       return false;
//     }
//     return true;
//   }

//   closeCreateModal(): void {
//     this.showCreateModal = false;
//     this.editingTenant = null;
//     this.resetNewTenant();
//   }

//   resetNewTenant(): void {
//     this.newTenant = {
//       name: '',
//       unitNumber: '',
//       floor: '',
//       contactEmail: '',
//       contactPhone: '',
//       accessKeyNR: '',
//       buildingId: '',
//       buildingEntryId: ''
//     };
//     this.filteredBuildingEntries = [];
//   }

//   // ================= UI HELPERS =================
//   toggleActionsMenu(tenantId: string, event?: Event): void {
//     if (event) event.stopPropagation();
//     this.activeActionsMenu = this.activeActionsMenu === tenantId ? null : tenantId;
//   }

//   isBuildingDisabled(): boolean {
//     return this.context === 'building' || this.context === 'entry';
//   }

//   isEntryDisabled(): boolean {
//     return this.context === 'entry';
//   }

//   showToast(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
//     if (this.toast.timeoutId) clearTimeout(this.toast.timeoutId);

//     this.toast = {
//       message, type, show: true, timeoutId: setTimeout(() => {
//         this.toast.show = false;
//         this.toast.timeoutId = null;
//       }, type === 'error' ? 5000 : 3000)
//     };
//   }

//   showConfirm(title: string, message: string, action: () => void, actionLabel = 'Konfirmo'): void {
//     this.confirmDialog = { show: true, title, message, action, actionLabel };
//   }

//   executeConfirmAction(): void {
//     this.confirmDialog.action();
//     this.closeConfirm();
//   }

//   closeConfirm(): void {
//     this.confirmDialog = {
//       show: false,
//       title: '',
//       message: '',
//       action: () => { },
//       actionLabel: 'Konfirmo'
//     };
//   }

//   // ================= PAGINATION =================
//   nextPage(): void {
//     if (this.hasNextPage) {
//       this.currentPage++;
//       this.loadTenants();
//     }
//   }

//   prevPage(): void {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.loadTenants();
//     }
//   }

//   getCurrentPageEnd(): number {
//     return Math.min(this.currentPage * this.pageSize, this.totalCount);
//   }

//   // ================= UTILITIES =================
//   onBuildingChange(): void {
//     this.newTenant.buildingEntryId = '';
//     this.filterBuildingEntries();
//   }

//   getMonthStatusClass(tenant: any, month: number): string {
//     const status = this.getDecisionStatusForMonth(tenant, month);

//     switch (status) {
//       case DecisionStatus.Allowed:
//         return 'bg-green-500 text-white border-green-600 hover:bg-green-600';
//       case DecisionStatus.Denied:
//         return 'bg-red-500 text-white border-red-600 hover:bg-red-600';
//       default:
//         return 'bg-yellow-400 text-white border-yellow-500 hover:bg-yellow-500';
//     }
//   }

//   getMonthTooltip(tenant: any, month: number): string {
//     const status = this.getDecisionStatusForMonth(tenant, month);
//     const monthName = this.getMonthName(month);

//     switch (status) {
//       case DecisionStatus.Allowed:
//         return `${monthName} - Paguar`;
//       case DecisionStatus.Denied:
//         return `${monthName} - Borxh`;
//       default:
//         return `${monthName} - Në pritje`;
//     }
//   }

//   showMonthDecisionPopup(tenant: any, month: number, event: Event): void {
//     event.stopPropagation();
//     const status = this.getDecisionStatusForMonth(tenant, month);

//     if (status !== DecisionStatus.Pending) {
//       const statusText = status === DecisionStatus.Allowed ? 'Paguar' : 'Borxh';
//       this.showConfirm(
//         'Vendim Ekzistues',
//         `Muaji ${this.getMonthName(month)} ${this.selectedYear} ka akses të vendosur si "${statusText}".\nDëshiron të ndryshosh?`,
//         () => {
//           this.openTenantModal(tenant);
//           setTimeout(() => {
//             this.selectedMonths[this.selectedYear] = [month];
//           }, 100);
//         },
//         'Ndrysho'
//       );
//     } else {
//       this.openTenantModal(tenant);
//       setTimeout(() => {
//         this.selectedMonths[this.selectedYear] = [month];
//       }, 100);
//     }
//   }
//   getLastNote(tenant: any): string | null {
//     if (!tenant.monthlyDecisions || tenant.monthlyDecisions.length === 0) {
//       return null;
//     }

//     // Sort decisions by date (newest first) and find the first one with notes
//     const decisionsWithNotes = [...tenant.monthlyDecisions]
//       .filter((d: any) => d.notes)
//       .sort((a, b) => {
//         // Sort by year and month (newest first)
//         if (a.year !== b.year) return b.year - a.year;
//         return b.month - a.month;
//       });

//     return decisionsWithNotes.length > 0 ? decisionsWithNotes[0].notes : null;
//   }
// }
