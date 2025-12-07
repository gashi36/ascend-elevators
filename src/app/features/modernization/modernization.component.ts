import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { TestimonialsComponent } from "../testimonials/testimonials.component";

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-modernization',
  templateUrl: './modernization.component.html',
  styleUrls: ['./modernization.component.scss'],
  standalone: true,
  imports: [TestimonialsComponent, RouterModule]
})
export class ModernizationComponent implements AfterViewInit {
  // stats
  stat1: number = 0;
  stat2: number = 0;
  stat3: number = 0;

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startCountAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const statsSection = this.el.nativeElement.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  private startCountAnimation() {
    this.animateValue('stat1', 85, 2000);
    this.animateValue('stat2', 72, 2000);
    this.animateValue('stat3', 90, 2000);
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
