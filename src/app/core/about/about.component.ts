import { Component, OnInit, ElementRef } from '@angular/core';
import * as AOS from 'aos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  // Percentage stats
  stat1 = 0;
  stat2 = 0;
  stat3 = 0;

  // Technician stats
  techStat1 = 0;
  techStat2 = 0;

  constructor(private router: Router, private el: ElementRef) { }

  ngOnInit() {
    // Initialize AOS animations
    AOS.init({ duration: 800, once: true });

    // Observe stats sections for count-up animations
    this.observeStats();
  }

  // Navigation
  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // IntersectionObservers for stats
  observeStats() {
    // Percentage stats
    const percentageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateValue('stat1', 98, 2000);
          this.animateValue('stat2', 96, 2000);
          this.animateValue('stat3', 75, 2000);
          percentageObserver.disconnect();
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }); // adjusted options for earlier trigger

    // NOTE: HTML uses class "stats-section" — observe that element
    const percentageSection = this.el.nativeElement.querySelector('.stats-section');
    if (percentageSection) percentageObserver.observe(percentageSection);

    // Technician stats
    const techObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateValue('techStat1', 28, 2000);
          this.animateValue('techStat2', 5, 2000);
          techObserver.disconnect();
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });

    const techSection = this.el.nativeElement.querySelector('.tech-stats');
    if (techSection) techObserver.observe(techSection);
  }

  // Count-up animation
  animateValue(stat: 'stat1' | 'stat2' | 'stat3' | 'techStat1' | 'techStat2', end: number, duration: number) {
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
