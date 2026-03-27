// src/app/app.routes.ts

import { Routes } from '@angular/router';

import { HeroComponent } from './features/hero/hero.component';
import { ServicesComponent } from './features/services/services.component';
import { TestimonialsComponent } from './features/testimonials/testimonials.component';
import { ContactComponent } from './features/contact/contact.component';
import { AboutComponent } from './core/about/about.component';
import { BlogDetailComponent } from './features/blog/blog-detail/blog-detail.component';
import { BlogListComponent } from './features/blog/blog-list/blog-list.component';
import { ModernizationComponent } from './features/modernization/modernization.component';
import { MaintenanceComponent } from './features/maintenance/maintenance.component';
import { RepairComponent } from './features/repair/repair.component';
import { LoginComponent } from './core/login/login.component';

import { AuthGuard } from './Guards/auth.guard';

import { AdminPanelComponent } from './dashboard/admin-panel/admin-panel.component';
import { UsersComponent } from './dashboard/admin-panel/users/users.component';
import { BuildingsAdminComponent } from './dashboard/admin-panel/buildings-admin/buildings-admin.component';
import { BuildingDetailsComponent } from './dashboard/admin-panel/building-details/building-details.component';
// import { BuildingsAdminComponent } from './dashboard/admin-panel/buildings-admin/buildings-admin.component';
// import { UsersComponent } from './dashboard/admin-panel/users/users.component';
// import { BuildingDetailsComponent } from './dashboard/admin-panel/building-details/building-details.component';
// import { TenantManagerComponent } from './dashboard/admin-panel/tenant-manager/tenant-manager.component';
// import { EntryDetailsComponent } from './dashboard/admin-panel/entry-details/entry-details.component';

export const routes: Routes = [

  // Public Routes
  { path: '', component: HeroComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'modernization', component: ModernizationComponent },
  { path: 'maintenance', component: MaintenanceComponent },
  { path: 'repair', component: RepairComponent },
  { path: 'blog', component: BlogListComponent },
  { path: 'blog/:slug', component: BlogDetailComponent },

  // Admin Routes
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'buildings', pathMatch: 'full' },

      { path: 'buildings', component: BuildingsAdminComponent },
      { path: 'buildings/:id', component: BuildingDetailsComponent },

      // { path: 'entry-details/:id', component: EntryDetailsComponent },

      // { path: 'tenants', component: TenantManagerComponent },
      { path: 'users', component: UsersComponent }
    ]
  },

  // Wildcard
  { path: '**', redirectTo: '' }

];
