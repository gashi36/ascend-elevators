import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { ContactComponent } from '../contact/contact.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [TestimonialsComponent,],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  constructor(private router: Router) { }
  navigateToContact(): void {
    // Replace '/contact' with the actual path to your contact or schedule page
    this.router.navigate(['/contact']);
  }
}
