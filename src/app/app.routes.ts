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

export const routes: Routes = [
  { path: '', component: HeroComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'modernization', component: ModernizationComponent },
  { path: 'maintenance', component: MaintenanceComponent },
  { path: 'repair', component: RepairComponent },
  { path: 'blog', component: BlogListComponent },
  { path: 'blog/:slug', component: BlogDetailComponent },
  { path: 'services', component: ServicesComponent },
  { path: '**', redirectTo: '' } // wildcard → home

];
