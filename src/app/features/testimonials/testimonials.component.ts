import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {

  currentIndex: number = 0;

  testimonials: any[] = [
    {
      nameKey: 'testimonials.0.name',
      titleKey: 'testimonials.0.title',
      textKey: 'testimonials.0.text'
    },
    {
      nameKey: 'testimonials.1.name',
      titleKey: 'testimonials.1.title',
      textKey: 'testimonials.1.text'
    },
    {
      nameKey: 'testimonials.2.name',
      titleKey: 'testimonials.2.title',
      textKey: 'testimonials.2.text'
    },
    {
      nameKey: 'testimonials.3.name',
      titleKey: 'testimonials.3.title',
      textKey: 'testimonials.3.text'
    }
  ];

  cardsPerView: number = 2;
  maxIndex: number;

  constructor() {
    this.maxIndex = this.testimonials.length - this.cardsPerView;
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      this.cardsPerView = 1;
    }
    this.maxIndex = this.testimonials.length - this.cardsPerView;
  }

  nextTestimonial(): void {
    if (this.currentIndex >= this.maxIndex) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
  }

  prevTestimonial(): void {
    if (this.currentIndex <= 0) {
      this.currentIndex = this.maxIndex;
    } else {
      this.currentIndex--;
    }
  }
}
