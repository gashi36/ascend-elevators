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
import { SuperadminPanelComponent } from './dashboard/superadmin-panel/superadmin-panel.component';
import { AuthGuard } from './Guards/auth.guard';
import { AdminPanelComponent } from './dashboard/admin-panel/admin-panel.component';
import { SuperadminGuard } from './Guards/superadmin.guard';
import { UsersSuperadminComponent } from './dashboard/superadmin-panel/users-superadmin/users-superadmin.component';
import { UsersDetailsSuperadminComponent } from './dashboard/superadmin-panel/users-details-superadmin/users-details-superadmin.component';

export const routes: Routes = [
  // Public routes
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

  // Admin Panel (Auth Required)
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [AuthGuard]
  },

  // SuperAdmin Panel (Auth + SuperAdmin Role Required)
  {
    path: 'superadmin-panel',
    component: SuperadminPanelComponent,
    canActivate: [AuthGuard, SuperadminGuard],
    children: [
      {
        path: 'users',
        component: UsersSuperadminComponent
      },
      {
        path: 'users/:id',
        component: UsersDetailsSuperadminComponent
      },
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      }
    ]
  },

  // Wildcard route - MUST BE LAST
  { path: '**', redirectTo: '' }
];
