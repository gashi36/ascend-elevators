import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-testimonials',
    imports: [CommonModule],
    templateUrl: './testimonials.component.html',
    styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit {

  currentIndex: number = 0;

  testimonials: any[] = [
    {
      name: 'Besnik Gashi',
      title: 'Menaxher i Objektit, Prishtinë',
      text: "Ascend ka revolucionarizuar transportin vertikal të ndërtesës sonë. Mirëmbajtja e tyre është proaktive, dhe qiramarrësit tanë komplimentojnë vazhdimisht ecjen e qetë. Të dish që kemi një ekip të besueshëm, lokal këtu në Kosovë, e bën të gjithë ndryshimin."
    },
    {
      name: 'Adelina Haxhiu',
      title: 'Pronare e Pronës, Lipjan',
      text: "Si pronare prone në Lipjan, unë vlerësoj profesionalizmin dhe shpejtësinë e Ascend. Ata ishin i vetmi ekip që mundi të menaxhonte modernizimin e sistemit tonë të vjetër në mënyrë të përsosur. Punë e shkëlqyer!"
    },
    {
      name: 'Edon Gashi',
      title: 'Administrator Ndërtese, Ferizaj',
      text: "Shërbim i jashtëzakonshëm! Inxhinierët e Ascend janë shumë të aftë dhe gjithmonë arrijnë shpejt. Ata ofrojnë zgjidhje të qarta dhe me kosto efektive—jo thjesht rregullime të shpejta. Ashensorët tanë po funksionojnë më sigurt dhe më me efikasitet se kurrë!"
    },
    {
      name: 'Luljeta Berisha',
      title: 'Menaxhere Hoteli, Durrës (Shqipëri)',
      text: "Edhe duke operuar jashtë Kosovës, Ascend ofron mbështetje të pakrahasueshme. Diagnostika e tyre është e saktë, dhe angazhimi i tyre për sigurinë është i nivelit të lartë. Një partner ashensorësh vërtet i besueshëm."
    }
  ];

  cardsPerView: number = 2;
  // Calculate the maximum possible index before wrapping/stopping
  maxIndex: number;

  constructor() {
    // Calculate maxIndex immediately
    this.maxIndex = this.testimonials.length - this.cardsPerView;
  }

  ngOnInit(): void {
    // Basic responsiveness: switch to 1 card per view on mobile screens
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      this.cardsPerView = 1;
    }
    // Recalculate max index based on the final cardsPerView
    this.maxIndex = this.testimonials.length - this.cardsPerView;
  }

  // Logic for the 'Next' button - Implements circular rotation
  nextTestimonial(): void {
    // Check if we are at the last visible set of cards (e.g., index 2 out of 4 total, 2 per view)
    if (this.currentIndex >= this.maxIndex) {
      // If at the end, jump back to the first index (0)
      this.currentIndex = 0;
    } else {
      // Otherwise, increment normally
      this.currentIndex++;
    }
  }

  // Logic for the 'Previous' button - Implements circular rotation
  prevTestimonial(): void {
    // Check if we are at the first index (0)
    if (this.currentIndex <= 0) {
      // If at the beginning, jump to the last possible index
      this.currentIndex = this.maxIndex;
    } else {
      // Otherwise, decrement normally
      this.currentIndex--;
    }
  }
}
