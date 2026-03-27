import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { ContactComponent } from '../contact/contact.component';
import { Router, RouterEvent, RouterModule } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [TestimonialsComponent, RouterModule, TranslatePipe],
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
