import { Component, signal } from '@angular/core';
import { FooterComponent } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterLink, NavbarComponent],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class About {
  constructor(private meta: Meta) {
    this.meta.updateTag({ name: 'description', content: 'Learn how TRAFFTAG protects your privacy with anonymous QR alerts for vehicles, pets, homes and belongings.' });
  }

  coreValues = signal([
    {
      title: 'Privacy First',
      desc: 'Your personal contact information is kept private from people who scan your tag.',
      icon: 'fa-solid fa-lock'
    },
    {
      title: 'Instant Routing',
      desc: 'Fast SMS and email notification delivery to get critical alerts to owners quickly.',
      icon: 'fa-solid fa-bolt'
    },
    {
      title: 'Built to Last',
      desc: 'Durable, weather-resistant QR decals designed for outdoor conditions — rain, sun, and daily wear.',
      icon: 'fa-solid fa-shield-halved'
    }
  ]);

  everydayUse = signal([
    {
      title: 'Personal Vehicle Alerts',
      desc: 'Providing critical communication access while preserving owner privacy.',
      icon: 'fa-solid fa-car'
    },
    {
      title: 'Pet ID Tags',
      desc: 'A durable, scannable ID that helps a lost pet get home faster.',
      icon: 'fa-solid fa-paw'
    },
    {
      title: 'Home Entry Alerts',
      desc: 'Ready for quick, anonymous alerts at the front door or gate.',
      icon: 'fa-solid fa-house'
    }
  ]);

  pageFaqs = signal([
    {
      question: 'Who is TRAFFTAG for?',
      answer: 'TRAFFTAG is built for everyday vehicle owners, pet owners, homeowners and renters, and anyone who wants a private way for someone to reach them about an urgent issue.',
      open: false
    },
    {
      question: 'How is TRAFFTAG different from just leaving a phone number?',
      answer: 'Unlike a visible phone number, TRAFFTAG never exposes your personal contact details. Alerts are routed anonymously, protecting you from spam, harassment, and identity theft.',
      open: false
    },
    {
      question: 'Is TRAFFTAG a security company or an emergency service?',
      answer: 'No. TRAFFTAG is an anonymous notification system, not a security company or emergency service. It does not replace 911 or official emergency response.',
      open: false
    }
  ]);

  toggleFaq(faqItem: any) {
    this.pageFaqs.update(list =>
      list.map(item => {
        if (item.question === faqItem.question) {
          return { ...item, open: !item.open };
        }
        return item;
      })
    );
  }
}
