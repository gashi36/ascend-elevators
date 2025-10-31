import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-repair',
  templateUrl: './repair.component.html',
  styleUrls: ['./repair.component.scss']
})
export class RepairComponent implements OnInit, AfterViewInit {
  // stats
  stat1 = 0;
  stat2 = 0;
  stat3 = 0;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    // Initialization logic if needed
  }

  // ensure DOM is rendered before querying .stats-section
  ngAfterViewInit() {
    this.observeStats();
  }

  observeStats() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateValue('stat1', 92, 2000);
          this.animateValue('stat2', 88, 2000);
          this.animateValue('stat3', 70, 2000);
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
