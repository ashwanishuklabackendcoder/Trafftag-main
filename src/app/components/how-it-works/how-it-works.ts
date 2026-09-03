import { FooterComponent } from '../footer/footer';
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterLink, NavbarComponent],
  templateUrl: './how-it-works.html',
  styleUrls: ['./how-it-works.css']
})
export class HowItWorks {
  isMenuOpen = signal(false);
  activeTab = signal<'public' | 'owner' | 'sync'>('public');

  steps = [
    {
      stepNumber: '01',
      title: 'Place Your Tag',
      subtitle: 'Ready to Scan',
      description: 'Place your TRAFFTAG QR tag or decal on your vehicle, pet collar, home entrance, or personal item.',
      icon: 'fa-solid fa-tag',
      badge: 'Step 1'
    },
    {
      stepNumber: '02',
      title: 'Anyone Scans It',
      subtitle: 'No App Required',
      description: 'Anyone who needs to contact you can scan the QR code with a smartphone camera — no app or account required.',
      icon: 'fa-solid fa-mobile-screen-button',
      badge: 'Step 2'
    },
    {
      stepNumber: '03',
      title: 'You Get Notified',
      subtitle: 'Your Contact Information Stays Private',
      description: 'You receive an alert by Email, SMS, or WhatsApp, depending on your plan and settings, while your phone number remains hidden from the scanner.',
      icon: 'fa-solid fa-bell',
      badge: 'Step 3'
    },
    {
      stepNumber: '04',
      title: 'Respond (Your Choice)',
      subtitle: 'Your Choice',
      description: 'Review the alert, send a reply using available TRAFFTAG communication options, or mark the alert as resolved while keeping your contact information private.',
      icon: 'fa-solid fa-comment-dots',
      badge: 'Step 4'
    }
  ];

  builtWithPrivacy = [
    {
      title: 'Private Contact Protection',
      desc: 'Your contact details are protected and are not displayed to anyone who scans your tag. The scanner only sees the available alert and contact options.',
      icon: 'fa-solid fa-lock'
    },
    {
      title: 'Multi-Channel Alert Delivery',
      desc: 'Depending on your plan and notification settings, alerts can be delivered by Email, SMS, or WhatsApp without requiring you to manually check the website.',
      icon: 'fa-solid fa-envelope-open-text'
    },
    {
      title: 'Multi-Tag Control Hub',
      desc: 'Manage your Vehicle, Pet, Home, Life, and Item Tags, review alert history, and check tag status from one dashboard.',
      icon: 'fa-solid fa-table-cells-large'
    }
  ];

  tagsInAction = [
    {
      title: 'Personal Vehicle Alerts',
      desc: 'Place a weather-resistant TRAFFTAG decal on your vehicle so someone can quickly scan it and send you an alert.',
      icon: 'fa-solid fa-car',
      colorClass: 'color-vehicle',
      image: 'hero-car-bg-1.jpg'
    },
    {
      title: 'Pet ID Alerts',
      desc: 'A scannable collar tag that can help someone contact you if your pet is found.',
      icon: 'fa-solid fa-paw',
      colorClass: 'color-pet',
      image: 'card_pet_new.jpg'
    },
    {
      title: 'Home Entry Alerts',
      desc: 'A decal at the front door or gate for deliveries, visitors, and safety concerns.',
      icon: 'fa-solid fa-house',
      colorClass: 'color-home',
      image: 'card_home_new.jpg'
    }
  ];

  pageFaqs = [
    {
      question: 'Do I need to install an app to use TRAFFTAG?',
      answer: 'No app is required to scan a TRAFFTAG QR code. A compatible smartphone camera can open the scan page. Tag owners need a TRAFFTAG account to register tags and manage alerts.',
      open: true
    },
    {
      question: 'How fast do I get notified after someone scans my tag?',
      answer: 'Alerts are generally sent shortly after the scanner submits an alert. Delivery time can vary by network and service provider. Depending on your plan and settings, notifications may be delivered by Email, SMS, or WhatsApp.',
      open: false
    },
    {
      question: 'Can I customize the alert messages someone can send me?',
      answer: 'Yes. Depending on the tag type, scanners can choose from available alert categories and may be able to add a short message or additional details before sending the alert.',
      open: false
    }
  ];

  setActiveTab(tab: 'public' | 'owner' | 'sync') {
    this.activeTab.set(tab);
  }
  
  toggleFaq(index: number) {
    this.pageFaqs[index].open = !this.pageFaqs[index].open;
  }
}


