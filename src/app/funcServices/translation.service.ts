import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private translations: any = {};
  private currentLangSubject = new BehaviorSubject<string>('sq');
  currentLang$ = this.currentLangSubject.asObservable();

  constructor() {
    this.loadLanguagePreference();
  }

  async setLanguage(lang: string) {
    // Validate language
    if (lang !== 'en' && lang !== 'sq') {
      console.error('Invalid language:', lang);
      return;
    }

    this.currentLangSubject.next(lang);

    // Save only to cookie
    this.setLanguageCookie(lang);

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

  // Optional: Clear language preference (logout)
  clearLanguagePreference(): void {
    this.cookieService.delete('language', '/');
    this.setLanguage('sq'); // Reset to default
  }

  // Private methods
  private loadLanguagePreference(): void {
    // Only read from cookie
    const savedLang = this.getLanguageCookie();

    if (savedLang && (savedLang === 'en' || savedLang === 'sq')) {
      this.setLanguage(savedLang);
    } else {
      this.setLanguage('sq');
    }
  }

  private setLanguageCookie(lang: string): void {
    const isSecure = window.location.protocol === 'https:';
    const expiryDays = 365; // Keep language preference for 1 year

    this.cookieService.set(
      'language',      // name
      lang,            // value
      expiryDays,      // expires in days
      '/',             // path (available on all pages)
      '',              // domain (current domain)
      isSecure,        // secure (HTTPS only)
      'Lax'            // sameSite (Lax is fine for language preference)
    );
  }

  private getLanguageCookie(): string | null {
    return this.cookieService.get('language') || null;
  }
}
