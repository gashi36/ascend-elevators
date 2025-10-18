// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HeroComponent } from './features/hero/hero.component';
import { ServicesComponent } from './features/services/services.component';
import { TestimonialsComponent } from './features/testimonials/testimonials.component';
import { ContactComponent } from './features/contact/contact.component';
import { AboutComponent } from './core/about/about.component';

export const routes: Routes = [
  { path: '', component: HeroComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' } // wildcard → home
];
