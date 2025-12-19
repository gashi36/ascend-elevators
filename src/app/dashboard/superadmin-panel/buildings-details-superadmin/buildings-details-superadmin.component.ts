// buildings-details-superadmin.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs/operators';
import { GetBuildingByIdGQL } from '../../../../graphql/generated/graphql';

@Component({
  selector: 'app-building-details-superadmin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buildings-details-superadmin.component.html',
  styleUrls: ['./buildings-details-superadmin.component.scss']
})
export class BuildingsDetailsSuperadminComponent implements OnInit {
  buildingId: string | null = null;
  building: any = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private buildingGQL: GetBuildingByIdGQL
  ) { }

  ngOnInit() {
    this.buildingId = this.route.snapshot.paramMap.get('id');

    if (this.buildingId) {
      this.loadBuildingDetails();
    } else {
      this.error = 'No building ID provided';
      this.isLoading = false;
    }
  }

  loadBuildingDetails() {
    this.isLoading = true;
    this.buildingGQL.fetch({
      variables: { id: this.buildingId! }
    })
      .pipe(take(1))
      .subscribe({
        next: (result: any) => {
          this.isLoading = false;
          this.building = result.data?.buildingById;

          if (!this.building) {
            this.error = 'Building not found';
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          this.error = 'Failed to load building details';
        }
      });
  }

  getUnitsWithTenants(tenants: any[]): number {
    if (!tenants || tenants.length === 0) return 0;

    const uniqueUnits = new Set(
      tenants
        .filter(tenant => tenant?.unitNumber)
        .map(tenant => tenant.unitNumber)
    );

    return uniqueUnits.size;
  }

  viewEntryTenants(entry: any) {
    if (!entry?.id) return;

    this.router.navigate(['/superadmin-panel/tenants-entry'], {
      queryParams: {
        buildingId: this.buildingId,
        entryId: entry.id,
        buildingName: this.building?.name,
        entryName: entry.name
      }
    });
  }

  goBack() {
    this.router.navigate(['/superadmin-panel']);
  }

  viewUser(userId: string) {
    this.router.navigate(['/superadmin-panel/users', userId]);
  }
}
