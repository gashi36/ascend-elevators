import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

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

  // Example user object (replace with your real auth service)
  currentUser: any = null;

  constructor(private router: Router) {
    this.loadUser();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  toggleMobileServices() {
    this.mobileServicesOpen = !this.mobileServicesOpen;
  }

  // Loads user from localStorage or wherever you store tokens
  loadUser() {
    const user = localStorage.getItem('user');
    this.currentUser = user ? JSON.parse(user) : null;
  }

  // Returns logged-in user info
  whoAmI() {
    return this.currentUser;
  }

  // Logout function
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUser = null;
    this.router.navigate(['/']);
  }
}
