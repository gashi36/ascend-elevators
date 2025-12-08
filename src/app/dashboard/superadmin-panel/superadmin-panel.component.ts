import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-superadmin-panel',
  templateUrl: './superadmin-panel.component.html',
  imports: [RouterModule, CommonModule],
  styleUrls: ['./superadmin-panel.component.scss'],
  standalone: true,
})
export class SuperadminPanelComponent implements OnInit {

  isSidebarOpen = true;
  isProfileOpen = false;
  isMobile = false;

  currentUser = {
    username: 'Superadmin'
  };

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth < 1024;
    if (this.isMobile) this.isSidebarOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
