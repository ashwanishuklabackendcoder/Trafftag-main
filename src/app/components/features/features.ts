import { FooterComponent } from '../footer/footer';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { Meta } from '@angular/platform-browser';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-features',
  imports: [FooterComponent, RouterLink, NavbarComponent, NgClass],
  templateUrl: './features.html',
  styleUrl: './features.css',
})
export class Features {
  isMenuOpen = signal(false);

  constructor(private meta: Meta) {
    this.meta.updateTag({ name: 'description', content: 'Discover TRAFFTAG\'s privacy features — masked contact, multi-channel alerts, and privacy-focused communication with custom messages and durable QR tags for vehicles, pets, homes, and items.' });
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  featuresList = signal([
    {
      icon: 'fa-solid fa-lock',
      title: 'Private Contact Protection',
      desc: 'Your contact information is not displayed to someone who scans your tag. All communication is handled through secure Email, SMS, or WhatsApp alerts.'
    },
    {
      icon: 'fa-solid fa-paper-plane',
      title: 'Multi-Channel Alerts',
      desc: 'When someone scans your TRAFFTAG QR code and submits an alert, you will be notified by Email, SMS, or WhatsApp based on your settings.'
    },
    {
      icon: 'fa-solid fa-table-cells-large',
      title: 'Multi-Tag Dashboard',
      desc: 'Manage all your Vehicle, Pet, Home, Life, and Item Tags under a single account. Download QR codes, view alert history, track status, and customize alert messages — all in one place.'
    },
    {
      icon: 'fa-solid fa-chart-line',
      title: 'Comprehensive Log Analytics',
      desc: 'View scan timestamps, available location information, and full alert history for every tag you own to stay informed and organized.'
    },
    {
      icon: 'fa-solid fa-message',
      title: 'Preset Custom Messages',
      desc: 'Choose from ready-to-use messages such as: "Your car is parked in a wrong zone," "You\'ve got loose," or "Your headlights are left on" — so the right alert reaches you fast.'
    },
    {
      icon: 'fa-solid fa-qrcode',
      title: 'Durable QR Stickers',
      desc: 'Our matte-laminated stickers are made to last and designed for daily use in normal weather conditions.'
    }
  ]);

  workflowSteps = signal([
    {
      step: '1. Scan',
      desc: 'Someone scans your TRAFFTAG QR code.',
      icon: 'fa-solid fa-qrcode'
    },
    {
      step: '2. Send Alert',
      desc: 'They select a category and send you an anonymous alert.',
      icon: 'fa-solid fa-paper-plane'
    },
    {
      step: '3. You Get Notified',
      desc: 'You receive the alert by Email, SMS, or WhatsApp.',
      icon: 'fa-solid fa-bell'
    },
    {
      step: '4. You Stay in Control',
      desc: 'Your contact details stay private and you decide what to do next.',
      icon: 'fa-solid fa-sliders'
    }
  ]);

  tagCategories = signal([
    { title: 'Vehicle Tags', icon: 'fa-solid fa-car', link: '/tags/vehicle' },
    { title: 'Pet Tags', icon: 'fa-solid fa-paw', link: '/tags/pet' },
    { title: 'Home Tags', icon: 'fa-solid fa-house', link: '/tags/home' },
    { title: 'Life Tags', icon: 'fa-solid fa-person', link: '/tags/life' },
    { title: 'Item Tags', icon: 'fa-solid fa-box', link: '/tags/item' }
  ]);

  additionalFeatures = signal([
    {
      title: 'Private Contact Protection',
      desc: 'Your contact information is protected and is not displayed to anyone who scans your tag. The scanner only sees the available alert options and can submit an alert anonymously.',
      icon: 'fa-solid fa-user-shield'
    },
    {
      title: 'Multi-Channel Alert Delivery',
      desc: 'Depending on your plan and notification settings, alerts can be delivered by Email, SMS, or WhatsApp without requiring you to manually check the website.',
      icon: 'fa-solid fa-envelope-open-text'
    },
    {
      title: 'Multi-Tag Control Hub',
      desc: 'Manage your Vehicle, Pet, Home, Life, and Item Tags, review alert history, download QR codes, and check tag status from one dashboard.',
      icon: 'fa-solid fa-boxes-stacked'
    },
    {
      title: 'Reliable & Secure Infrastructure',
      desc: 'Built on trusted cloud infrastructure with secure data handling, encrypted communication, and regular system monitoring.',
      icon: 'fa-solid fa-server'
    }
  ]);

  pageFaqs = [
    {
      question: 'How does TRAFFTAG keep my contact information private?',
      answer: 'Your contact information is not displayed to someone who scans your tag. All communication is routed through secure Email, SMS, or WhatsApp alerts.',
      open: true
    },
    {
      question: 'Can I manage more than one tag from a single account?',
      answer: 'Yes. The multi-tag dashboard lets you manage vehicle, pet, home, life, and item tags together, download QR codes, and customize alert messages for each.',
      open: false
    },
    {
      question: 'What are TRAFFTAG stickers made of?',
      answer: 'They are high-quality matte-laminated stickers designed for everyday use in normal weather conditions.',
      open: false
    },
    {
      question: 'Can I see when and where my tag was scanned?',
      answer: 'Yes. Your dashboard can show available scan information, such as the time of the scan, submitted location information where available, and alert history. TRAFFTAG does not identify an anonymous scanner unless that person voluntarily provides information.',
      open: false
    },
    {
      question: 'Where can I use TRAFFTAG tags?',
      answer: 'On vehicles, pet collars, home entrances, personal items, luggage, trade tools, and many other everyday items.',
      open: false
    },
    {
      question: 'How fast will I get notified after someone scans my tag?',
      answer: 'Alerts are generally sent shortly after an alert is submitted. Delivery time can vary by network and device provider.',
      open: false
    }
  ];

  toggleFaq(index: number) {
    this.pageFaqs[index].open = !this.pageFaqs[index].open;
  }
}


