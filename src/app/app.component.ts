// src/app/app.component.ts
import { Component } from '@angular/core';

import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FooterComponent } from './core/footer/footer.component';
import { HeaderComponent } from "./core/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Scroll to top on every route change
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      });
  }
}
