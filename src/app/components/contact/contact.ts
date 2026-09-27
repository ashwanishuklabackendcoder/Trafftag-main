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
      question: 'Which email should I use to get help with my Tag?',
      answer: 'Please use the specific email for your tag category: Myhappyvehicletag@gmail.com (Vehicles), Myhappyhometag@gmail.com (Home/Business), Myhappypettag@gmail.com (Pets), myhappylifetag@gmail.com (Life Tag), or Myhappyitemtag@gmail.com (Item Tag).',
      open: false
    },
    {
      question: 'What information should I include in my email or text?',
      answer: 'For faster service, please provide your email address, describe your issue, and specify which tag category you are having an issue with.',
      open: false
    },
    {
      question: 'How can I contact you by phone or text?',
      answer: 'You can text or call us at 1 (201) 206-4869 for all other inquiries regarding tags.',
      open: false
    },
    {
      question: 'How long does it take to get a response?',
      answer: 'We will get back with you within 24 to 72 hours.',
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


