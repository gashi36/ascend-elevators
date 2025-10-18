import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  sending = false;
  success = '';
  error = '';
  preferredContact = '';
  helpOptions: string[] = []; // store selected checkboxes
  @ViewChild('contactFormElement') contactForm!: ElementRef<HTMLFormElement>;


  // Called when a checkbox is toggled
  toggleHelp(option: string, event: any) {
    if (event.target.checked) {
      this.helpOptions.push(option);
    } else {
      this.helpOptions = this.helpOptions.filter(o => o !== option);
    }
  }

  sendEmail() {
    this.sending = true;
    this.success = '';
    this.error = '';

    const form = this.contactForm.nativeElement;

    // Add a hidden input with joined help options
    let helpInput = form.querySelector('input[name="helpJoined"]') as HTMLInputElement;
    if (!helpInput) {
      helpInput = document.createElement('input');
      helpInput.type = 'hidden';
      helpInput.name = 'helpJoined';
      form.appendChild(helpInput);
    }
    helpInput.value = this.helpOptions.join(', ');

    emailjs
      .sendForm(
        'service_0s4y44k',     // replace with your EmailJS service ID
        'template_yulujqm',    // replace with your EmailJS template ID
        form,
        'Q5F90FDeNAiylqkUw'      // replace with your EmailJS public key
      )
      .then(
        (result: EmailJSResponseStatus) => {
          this.success = 'Message sent successfully!';
          this.sending = false;
          form.reset();
          this.helpOptions = [];
        },
        (error) => {
          console.error('EmailJS Error:', error);
          this.error = 'Failed to send message. Please try again.';
          this.sending = false;
        }
      );
  }
}
