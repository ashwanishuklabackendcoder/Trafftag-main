import { FooterComponent } from '../footer/footer';
import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  imports: [FooterComponent, RouterLink, NavbarComponent],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {
  isMenuOpen = signal(false);

  constructor(private meta: Meta) {
    this.meta.updateTag({ name: 'description', content: 'Answers to common TRAFFTAG questions — privacy, QR tag setup, shipping, billing, and how anonymous alerts work for vehicles, pets, homes, life tags & items.' });
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  activeCategory = signal('all');

  faqsList = signal([
    {
      question: 'How does TRAFFTAG protect my privacy?',
      answer: 'Your personal phone number and contact information are not displayed to the person scanning your tag. Alerts are routed through TRAFFTAG according to your notification settings.',
      category: 'privacy',
      open: false
    },
    {
      question: 'Do I need an app to scan the code?',
      answer: 'No. Any smartphone camera can scan a TRAFFTAG QR code — no app download or account is needed by the person sending the alert. You only need a TRAFFTAG account to receive and manage alerts.',
      category: 'scans',
      open: false
    },
    {
      question: 'How do I activate a new QR tag?',
      answer: 'Create a TRAFFTAG account, then register your tag\'s unique code under "Add a Tag." Choose the category — vehicle, pet, home, life, or item — set your contact preferences, and your tag can be activated after registration is completed.',
      category: 'scans',
      open: false
    },
    {
      question: 'Are there any shipping costs for physical stickers?',
      answer: 'Shipping costs vary by plan, quantity, and delivery location, and are shown clearly at checkout before you complete your order.',
      category: 'account',
      open: false
    },
    {
      question: 'What types of vehicles, pets, homes, life tags, or items can I use TRAFFTAG for?',
      answer: 'TRAFFTAG works on virtually anything you want to protect: cars, motorcycles, scooters, e-bikes, trucks, SUVs, RVs, boats and trailers, dogs, cats, birds and other pets, home entrances and gates, life tags for adults, seniors and students, and everyday items like keys, phones, laptops, luggage, and wallets.',
      category: 'scans',
      open: false
    },
    {
      question: 'Is TRAFFTAG a replacement for 911 or emergency services?',
      answer: 'No. TRAFFTAG is an anonymous notification system, not an emergency service. It does not replace 911 or any official emergency response, and it does not guarantee prevention of damage, loss, or towing. Always contact emergency services directly for urgent situations.',
      category: 'privacy',
      open: false
    },
    {
      question: 'Can I use one TRAFFTAG account for multiple tags (car, pet, home, life, or item)?',
      answer: 'Yes. One TRAFFTAG account manages all of your tags — vehicle, pet, home, life, and item — from a single dashboard, with separate alert settings for each.',
      category: 'account',
      open: false
    }
  ]);

  filteredFaqs = computed(() => {
    const cat = this.activeCategory();
    const items = this.faqsList();
    if (cat === 'all') return items;
    return items.filter(item => item.category === cat);
  });

  toggleFaq(faqItem: any) {
    this.faqsList.update(list => 
      list.map(item => {
        if (item.question === faqItem.question) {
          return { ...item, open: !item.open };
        }
        return item;
      })
    );
  }
}


