import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';

export interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  highlightText: string;
  description: string;
  tags: string[];
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  taxiType: string;
  statusBadge: string;
  imageAlt: string;
  bgImage: string;
  cardImage: string;
  visualType: 'qr-taxi-fleet' | 'echallan-speed' | 'sos-privacy' | 'weatherproof-decal';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, NavbarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  constructor(private router: Router) { }

  mobileMenuOpen = signal(false);

  // Hero Carousel State & Auto-play
  currentSlide = signal(0);
  isPaused = signal(false);
  private autoPlayInterval: any = null;

  heroSlides: HeroSlide[] = [
    {
      id: 1,
      badge: 'COMMERCIAL GRADE DURABILITY',
      title: 'Tamper-Proof Decals & Tags for Cabs',
      highlightText: 'COMMERCIAL QR DECALS',
      description: 'Engineered for intense heat, heavy monsoon rain, and daily wear. High-visibility metallic accent decals designed specifically for cab windshields, rear doors, and passenger headrests.',
      tags: ['UV & Scratch Resistant', 'Tamper Evident Shield', 'Bulk Fleet Decals'],
      ctaText: 'ORDER TAXI DECALS',
      ctaLink: '/register',
      secondaryCtaText: 'SUPPORT & FAQ',
      secondaryCtaLink: '#faq',
      taxiType: 'AUTO-RICKSHAWS & TAXIS',
      statusBadge: 'PREMIUM REFLECTIVE DECAL',
      imageAlt: 'Weatherproof Taxi QR Decal',
      bgImage: 'hero-car-bg-1.png',
      cardImage: 'trafftag-official-decal.png',
      visualType: 'weatherproof-decal'
    },
    {
      id: 2,
      badge: 'NEXT-GEN TAXI FLEET MANAGEMENT',
      title: 'Smart QR Tags for Taxis & Rideshare Cabs',
      highlightText: 'TRAFFTAG TAXI',
      description: 'Equip your taxi fleet with tamper-proof QR tags. Passengers can instantly verify driver identity, check fare transparency, and trigger emergency SOS with a single smartphone scan.',
      tags: ['24/7 Driver Verification', 'Instant Ride Security', 'Commercial Decals'],
      ctaText: 'REGISTER TAXI FLEET',
      ctaLink: '/register',
      secondaryCtaText: 'EXPLORE FEATURES',
      secondaryCtaLink: '/features',
      taxiType: 'YELLOW CAB & RIDESHARE',
      statusBadge: 'LIVE TAXI QR ACTIVE',
      imageAlt: 'Smart QR Taxi Fleet Management',
      bgImage: 'hero-car-bg-2.png',
      cardImage: 'taxi-transparent.png',
      visualType: 'qr-taxi-fleet'
    },
    {
      id: 3,
      badge: 'AUTOMATED FLEET COMPLIANCE',
      title: 'Never Miss a Taxi Traffic Fine or E-Challan',
      highlightText: 'INSTANT E-CHALLAN',
      description: 'Automated real-time SMS & WhatsApp alerts for cab owners. Search pending traffic fines instantly by vehicle registration number and clear fines in seconds with bank-grade encryption.',
      tags: ['Real-Time Fine Alerts', 'Instant Payment Receipt', 'Zero Fleet Downtime'],
      ctaText: 'CHECK TAXI STATUS',
      ctaLink: '/scan',
      secondaryCtaText: 'VIEW PRICING PLANS',
      secondaryCtaLink: '#pricing',
      taxiType: 'COMMERCIAL CAB FLEET',
      statusBadge: 'TRAFFIC PORTAL CONNECTED',
      imageAlt: 'Taxi E-Challan Compliance',
      bgImage: 'hero-car-bg-3.png',
      cardImage: 'echallan-transparent.png',
      visualType: 'echallan-speed'
    },
    {
      id: 4,
      badge: '100% PRIVACY & PASSENGER SAFETY',
      title: 'In-Cab SOS & Masked Emergency Contact',
      highlightText: 'PASSENGER SOS',
      description: 'Keep driver and passenger personal numbers completely private. Passengers scan the in-cab QR code to share live trip progress with family or alert emergency dispatch instantly.',
      tags: ['Masked Phone Call', 'One-Tap SOS Trigger', 'End-to-End Encrypted'],
      ctaText: 'GET TAXI SAFETY TAG',
      ctaLink: '/register',
      secondaryCtaText: 'HOW SOS WORKS',
      secondaryCtaLink: '#how-it-works',
      taxiType: 'EXECUTIVE & CITY CABS',
      statusBadge: '24/7 SOS MONITORING',
      imageAlt: 'In-Cab Passenger Safety SOS',
      bgImage: 'hero-car-bg-4.png',
      cardImage: 'sos-transparent.png',
      visualType: 'sos-privacy'
    }
  ];

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      if (!this.isPaused()) {
        this.nextSlide();
      }
    }, 5500);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  pauseAutoPlay() {
    this.isPaused.set(true);
  }

  resumeAutoPlay() {
    this.isPaused.set(false);
  }

  nextSlide() {
    this.currentSlide.update(idx => (idx + 1) % this.heroSlides.length);
  }

  prevSlide() {
    this.currentSlide.update(idx => (idx - 1 + this.heroSlides.length) % this.heroSlides.length);
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  faqs = signal([
    {
      question: 'What is TRAFFTAG and how does it protect my vehicle?',
      answer: 'TRAFFTAG is a unified traffic compliance and vehicle identification system. By attaching our tamper-proof QR tag to your vehicle, you can check challan status, pay fines instantly, receive real-time alerts, and easily communicate with traffic officials.',
      open: true
    },
    {
      question: 'How do I check if my vehicle has pending traffic fines?',
      answer: 'Simply click on "Check Status" or "Pay Fine" on our homepage, enter your Vehicle Registration Number or Challan ID, and view instant live results.',
      open: false
    },
    {
      question: 'Are online payment transactions on TRAFFTAG safe?',
      answer: 'Yes, all transactions are protected by bank-grade 256-bit SSL encryption and integrated directly with official payment gateways.',
      open: false
    },
    {
      question: 'Is my personal contact information visible to public scanners?',
      answer: 'No! Your privacy is protected. Public scans only display masked safety emergency options unless authorized by traffic enforcement credentials.',
      open: false
    }
  ]);

  whyFeatures = [
    { label: 'Fast & Secure Payments', icon: 'fa-solid fa-credit-card' },
    { label: 'Real-time Updates', icon: 'fa-solid fa-clock-rotate-left' },
    { label: 'All in One Solution', icon: 'fa-solid fa-layer-group' },
    { label: 'User Friendly Interface', icon: 'fa-solid fa-desktop' },
    { label: 'Secure Transactions', icon: 'fa-solid fa-user-shield' },
    { label: '24/7 Support', icon: 'fa-solid fa-headset' }
  ];

  toggleFaq(index: number) {
    this.faqs.update(list => {
      list[index].open = !list[index].open;
      return [...list];
    });
  }

  billingCycle = signal<'monthly' | 'yearly'>('monthly');

  setBillingCycle(cycle: 'monthly' | 'yearly') {
    this.billingCycle.set(cycle);
  }

  membershipPlans = signal([
    {
      name: 'BASIC PLAN',
      lifetimePrice: '$99.99',
      monthlyPrice: '$14.99',
      included: '5 SMS',
      noPlanPrice: '$49.99 /month',
      featured: false
    },
    {
      name: 'STARTER PLAN',
      lifetimePrice: '$199.99',
      monthlyPrice: '$19.99',
      included: '10 SMS',
      noPlanPrice: '$49.99 /month',
      featured: false
    },
    {
      name: 'POPULAR PLAN',
      lifetimePrice: '$299.99',
      monthlyPrice: '$29.99',
      included: '30 SMS',
      noPlanPrice: '$49.99 /month',
      featured: true
    },
    {
      name: 'PREMIUM PLAN',
      lifetimePrice: '$499.00',
      monthlyPrice: '$59.99',
      included: '50 SMS',
      noPlanPrice: '$49.99 /month',
      featured: false
    },
    {
      name: 'LUXURY PLAN',
      lifetimePrice: '$999.99',
      monthlyPrice: '$99.99',
      included: '125 SMS',
      noPlanPrice: '$49.99 /month',
      featured: false
    },
    {
      name: 'PLATINUM PLAN',
      lifetimePrice: '$1,999.99',
      monthlyPrice: '$199.99',
      included: '250 SMS + 30 Email',
      noPlanPrice: '$49.99 /month',
      featured: false
    }
  ]);

  notificationPackages = signal([
    {
      title: 'SMS NOTIFICATION PACKAGE',
      price: '$49.99',
      details: '(5 SMS ONLY)',
      type: 'sms'
    },
    {
      title: 'EMAIL ALERT NOTIFICATION PACKAGE',
      price: '$49.99',
      details: '(5 EMAIL ALERT NOTIFICATION ONLY)',
      type: 'email'
    },
    {
      title: 'WHATSAPP NOTIFICATIONS',
      price: '$99.99',
      details: '(15 NOTIFICATIONS ON GIVEN NUMBER)',
      type: 'whatsapp'
    }
  ]);

  openServiceModal(serviceName: string) {
    if (serviceName === 'Pay Fine' || serviceName === 'Check Status') {
      this.router.navigate(['/scan']);
    } else if (serviceName === 'My Violations') {
      this.router.navigate(['/portal']);
    } else {
      this.router.navigate(['/features']);
    }
  }

  scrollPricing(direction: 'left' | 'right') {
    const container = document.getElementById('pricing-slider-track');
    if (container) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}
