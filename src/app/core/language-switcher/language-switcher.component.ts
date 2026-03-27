import { Component } from '@angular/core';
import { TranslationService } from '../../funcServices/translation.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html'
})
export class LanguageSwitcherComponent {
  currentLang: string;

  constructor(public translationService: TranslationService) {
    this.currentLang = translationService.getCurrentLanguage();
  }

  switchLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.currentLang = lang;
  }
}
