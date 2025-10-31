import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';
import * as AOS from 'aos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  // Percentage stats
  stat1 = 0;
  stat2 = 0;
  stat3 = 0;

  // Technician stats
  techStat1 = 0;
  techStat2 = 0;

  @ViewChild('navSentinel', { static: true }) navSentinel!: ElementRef;
  @ViewChild('aboutNav', { static: true }) aboutNav!: ElementRef;

  private sentinelObserver?: IntersectionObserver;
  private resizeListener?: () => void;
  private placeholderEl?: HTMLElement;

  constructor(private router: Router, private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    // Initialize AOS animations
    AOS.init({ duration: 800, once: true });

    // Observe stats sections for count-up animations
    this.observeStats();
  }

  ngAfterViewInit() {
    // Setup sentinel observer to toggle fixed nav under the header
    const headerEl = document.querySelector('header');
    const getHeaderHeight = () => headerEl ? headerEl.getBoundingClientRect().height : 80;

    const navEl: HTMLElement = this.aboutNav.nativeElement;

    // create placeholder to avoid layout jump when nav becomes fixed
    const pl = this.renderer.createElement('div') as HTMLElement;
    pl.style.height = `${navEl.getBoundingClientRect().height}px`;
    pl.style.display = 'none';
    this.placeholderEl = pl;

    const parent = navEl.parentNode as Node | null;
    if (parent) {
      this.renderer.insertBefore(parent, this.placeholderEl, navEl);
    }

    this.sentinelObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          // sentinel left viewport -> stick nav under header
          if (this.placeholderEl) this.placeholderEl.style.display = '';
          navEl.classList.add('fixed-nav');
          navEl.style.position = 'fixed';
          navEl.style.top = `${getHeaderHeight()}px`;
          navEl.style.left = '0';
          navEl.style.right = '0';
          navEl.style.width = '100%';
        } else {
          // sentinel visible -> restore normal flow
          if (this.placeholderEl) this.placeholderEl.style.display = 'none';
          navEl.classList.remove('fixed-nav');
          navEl.style.position = '';
          navEl.style.top = '';
          navEl.style.left = '';
          navEl.style.right = '';
          navEl.style.width = '';
        }
      });
    }, { threshold: 0 });

    this.sentinelObserver.observe(this.navSentinel.nativeElement);

    // update top value on resize (header height can change)
    this.resizeListener = () => {
      if (navEl.classList.contains('fixed-nav')) {
        navEl.style.top = `${getHeaderHeight()}px`;
      }
      // also update placeholder height if nav resized
      if (this.placeholderEl) {
        this.placeholderEl.style.height = `${navEl.getBoundingClientRect().height}px`;
      }
    };
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnDestroy() {
    this.sentinelObserver?.disconnect();
    if (this.resizeListener) window.removeEventListener('resize', this.resizeListener);
    if (this.placeholderEl && this.placeholderEl.parentNode) {
      this.placeholderEl.parentNode.removeChild(this.placeholderEl);
    }
  }

  // Navigation
  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (!element) return;

    // compute header + nav height to offset the scroll so section lands below header+nav
    const headerEl = document.querySelector('header');
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 80;
    const navHeight = this.aboutNav && this.aboutNav.nativeElement
      ? this.aboutNav.nativeElement.getBoundingClientRect().height
      : 64;

    const top = element.getBoundingClientRect().top + window.scrollY - (headerHeight + navHeight);
    window.scrollTo({ top, behavior: 'smooth' });
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
