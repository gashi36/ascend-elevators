import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactComponent } from '../../features/contact/contact.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isOpen = false;
  mobileServicesOpen = false;
  toggle() { this.isOpen = !this.isOpen; }
  toggleMobileServices() { this.mobileServicesOpen = !this.mobileServicesOpen; }
}
