import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../funcServices/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Makes it reactive to language changes
})
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslationService);

  transform(key: string): string {
    return this.translationService.translate(key);
  }
}
