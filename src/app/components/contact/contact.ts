import { FooterComponent } from '../footer/footer';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  name = signal('');
  email = signal('');
  subject = signal('');
  message = signal('');
  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  submitContact() {
    if (!this.name() || !this.email() || !this.message()) {
      this.errorMessage.set('Please fill out all required fields.');
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.successMessage.set('Thank you! Your message has been sent successfully. Our team will respond within 24 hours.');
      this.name.set('');
      this.email.set('');
      this.subject.set('');
      this.message.set('');
    }, 1000);
  }
}


