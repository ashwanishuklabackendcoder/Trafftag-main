import { FooterComponent } from '../footer/footer';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})
export class Contact {
  constructor(private meta: Meta) {
    this.meta.updateTag({ name: 'description', content: 'Contact TRAFFTAG for tag inquiries, investment opportunities, or general support.' });
  }

  name = signal('');
  email = signal('');
  subject = signal('');
  message = signal('');
  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  faqs = signal([
    {
      question: 'How can I inquire about Tag or investment opportunities?',
      answer: 'Please email us at mytrafftag@gmail.com.',
      open: false
    },
    {
      question: 'How can I ask general questions about TraffTag?',
      answer: 'Please email us at trafftag@gmail.com.',
      open: false
    },
    {
      question: 'How can I reach an additional contact for other matters?',
      answer: 'Please email us at trafftagofficial@gmail.com.',
      open: false
    },
    {
      question: 'How long does it take to get a response?',
      answer: 'We aim to respond to all inquiries within 24–72 hours.',
      open: false
    },
    {
      question: 'What information should I include in my email?',
      answer: 'Please include your name, a clear subject, and a detailed message so we can assist you better.',
      open: false
    }
  ]);

  toggleFaq(faqItem: any) {
    this.faqs.update(list =>
      list.map(item => {
        if (item.question === faqItem.question) {
          return { ...item, open: !item.open };
        }
        return item;
      })
    );
  }

  submitContact() {
    if (!this.name() || !this.email() || !this.subject() || !this.message()) {
      this.errorMessage.set('Please fill out all required fields.');
      return;
    }

    this.errorMessage.set('');
    this.isSubmitting.set(true);

    // Prompt requested we do not fake success and instead report that a backend endpoint is required.
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.errorMessage.set('A backend contact submission endpoint is required to process this form.');
      this.successMessage.set('');
    }, 1000);
  }
}
