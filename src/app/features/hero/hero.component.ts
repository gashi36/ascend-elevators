import { Component, ElementRef, QueryList } from '@angular/core';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { ContactComponent } from '../contact/contact.component';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-hero',
    imports: [TestimonialsComponent, RouterModule],
    templateUrl: './hero.component.html',
    styleUrl: './hero.component.scss'
})


export class HeroComponent {
  constructor(private router: Router) { }
  navigateToContact(): void {
    // Replace '/contact' with the actual path to your contact or schedule page
    this.router.navigate(['/contact']);
  }

}
