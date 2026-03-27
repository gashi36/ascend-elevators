import { Component } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-footer',
  imports: [TranslatePipe, CommonModule],
  templateUrl: './footer.component.html'
})
export class FooterComponent { }
