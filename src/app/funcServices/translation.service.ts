import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private http = inject(HttpClient);
  private translations: any = {};
  private currentLangSubject = new BehaviorSubject<string>('sq');
  currentLang$ = this.currentLangSubject.asObservable();

  constructor() {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('language');
    if (savedLang && (savedLang === 'en' || savedLang === 'sq')) {
      this.setLanguage(savedLang);
    } else {
      this.setLanguage('sq');
    }
  }

  async setLanguage(lang: string) {
    this.currentLangSubject.next(lang);
    localStorage.setItem('language', lang);

    try {
      const data = await firstValueFrom(this.http.get(`/assets/i18n/${lang}.json`));
      this.translations = data;
    } catch (error) {
      console.error('Error loading translations', error);
    }
  }

  translate(key: string): string {
    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key;
      }
    }

    return value;
  }

  getCurrentLanguage(): string {
    return this.currentLangSubject.value;
  }
}
