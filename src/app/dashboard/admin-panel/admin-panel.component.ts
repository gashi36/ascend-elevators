import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Guards/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-panel.component.html'
})
export class AdminPanelComponent {
  // Inject style for consistency
  public authService = inject(AuthService);

  // Signal for the mobile drawer
  isMobileMenuOpen = signal(false);

  toggleMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }
  closeMenu() {
    this.isMobileMenuOpen.set(false);
  }
  logout() {
    this.authService.logout();
  }

}
