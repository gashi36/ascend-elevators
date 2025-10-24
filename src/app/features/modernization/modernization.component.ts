import { Component, OnInit, ElementRef } from '@angular/core';
import { TestimonialsComponent } from "../testimonials/testimonials.component";

@Component({
  selector: 'app-modernization',
  templateUrl: './modernization.component.html',
  standalone: true,
  styleUrls: ['./modernization.component.css'],
  imports: [TestimonialsComponent]
})
export class ModernizationComponent implements OnInit {

  // stats
  stat1 = 0;
  stat2 = 0;
  stat3 = 0;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.observeStats();
  }

  // IntersectionObserver + count-up
  observeStats() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateValue('stat1', 85, 1800);
          this.animateValue('stat2', 72, 1800);
          this.animateValue('stat3', 90, 1800);
          observer.disconnect();
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });

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
