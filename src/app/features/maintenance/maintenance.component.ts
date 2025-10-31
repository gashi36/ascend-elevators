import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
  imports: [TestimonialsComponent, CommonModule]
})
export class MaintenanceComponent implements OnInit, AfterViewInit {
  // stats
  stat1 = 0;
  stat2 = 0;
  stat3 = 0;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    // ...existing code...
  }

  ngAfterViewInit() {
    // start observer after view is initialized so .stats-section exists
    this.observeStats();
  }

  observeStats() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateValue('stat1', 95, 2000);
          this.animateValue('stat2', 91, 2000);
          this.animateValue('stat3', 60, 2000);
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    const section = this.el.nativeElement.querySelector('.stats-section');
    if (section) observer.observe(section);
  }

  animateValue(stat: 'stat1' | 'stat2' | 'stat3', end: number, duration: number) {
    let start = 0;
    const frameDuration = 50;
    const increments = Math.max(1, Math.floor(duration / frameDuration));
    const increment = end / increments;

    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        this[stat] = end;
        clearInterval(interval);
        return;
      }
      this[stat] = Math.floor(start);
    }, frameDuration);
  }
}
