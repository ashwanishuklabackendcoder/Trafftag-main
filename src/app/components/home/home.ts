import { FooterComponent } from '../footer/footer';
import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../config/api.config';
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
  imports: [FooterComponent, RouterLink, CommonModule, NavbarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  constructor(private router: Router) { }

  http = inject(HttpClient);
  mobileMenuOpen = signal(false);

  // Hero Carousel State & Auto-play
  currentSlide = signal(0);
  isPaused = signal(false);
  private autoPlayInterval: any = null;

  heroSlides: HeroSlide[] = [
    {
      id: 1,
      badge: 'Every Vehicle Deserves Trafftag',
      title: 'Cars, Bikes & Every Vehicle',
      highlightText: 'Smart QR Tags for',
      description: 'QR decals let someone safely alert you about lights left on, a blocked driveway, or a vehicle that needs to be moved — without seeing your phone number.',
      tags: ['Fits Cars, Motorcycles, Scooters, & RVs'],
      ctaText: 'Get Your Happy Trafftag',
      ctaLink: '/register',
      secondaryCtaText: 'See How It Works',
      secondaryCtaLink: '#how-it-works',
      taxiType: 'AUTO-RICKSHAWS & TAXIS',
      statusBadge: 'PREMIUM REFLECTIVE DECAL',
      imageAlt: 'Weatherproof Taxi QR Decal',
      bgImage: 'hero-car-bg-1.png',
      cardImage: 'card-vehicle-transparent.png',
      visualType: 'weatherproof-decal'
    },
    {
      id: 2,
      badge: 'Help Bring Them Home Faster',
      title: 'Help Bring Them Home Faster with a TRAFFTAG Pet Tag',
      highlightText: 'Lost Pet?',
      description: 'A scannable collar tag lets anyone who finds your pet send an instant, anonymous alert with the location — without seeing your personal phone number.',
      tags: [],
      ctaText: 'Get a Pet Tag',
      ctaLink: '/register',
      secondaryCtaText: 'How Pet Alerts Work',
      secondaryCtaLink: '#how-it-works',
      taxiType: 'YELLOW CAB & RIDESHARE',
      statusBadge: 'LIVE TAXI QR ACTIVE',
      imageAlt: 'Smart QR Taxi Fleet Management',
      bgImage: 'hero-car-bg-2.png',
      cardImage: 'taxi-transparent.png',
      visualType: 'qr-taxi-fleet'
    },
    {
      id: 3,
      badge: 'Protect Your Property',
      title: 'Your Home, Gate & Doorstep',
      highlightText: 'Anonymous Alerts for',
      description: 'A TRAFFTAG tag at your entrance lets delivery drivers, neighbors, or visitors reach you for packages, access issues, or safety concerns — without seeing your phone number.',
      tags: [],
      ctaText: 'Get a Home Tag',
      ctaLink: '/register',
      secondaryCtaText: 'Support & FAQ',
      secondaryCtaLink: '#faq',
      taxiType: 'COMMERCIAL CAB FLEET',
      statusBadge: 'TRAFFIC PORTAL CONNECTED',
      imageAlt: 'Taxi E-Challan Compliance',
      bgImage: 'hero-car-bg-3.png',
      cardImage: 'echallan-transparent.png',
      visualType: 'echallan-speed'
    }
  ];

  ngOnInit() {
    this.startAutoPlay();
    this.loadMembershipPlans();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  loadMembershipPlans() {
    this.http.get<any>(`${API_BASE_URL}/api/v1/memberships/plans`)
      .subscribe({
        next: (res) => {
          if (res?.success && Array.isArray(res.data)) {
            // Map the data to include UI-specific properties
            const plans = res.data.map((plan: any, index: number) => ({
              ...plan,
              isDynamic: true,
              featured: plan.name.toLowerCase().includes('premium monthly') || plan.planId === 2 || plan.planId === 3,
              lifetimePrice: `$${plan.price.toFixed(2)}`,
              monthlyPrice: `$${plan.price.toFixed(2)}`
            }));
            this.membershipPlans.set(plans);
          } else if (Array.isArray(res)) {
            const plans = res.map((plan: any, index: number) => ({
              ...plan,
              isDynamic: true,
              featured: plan.name.toLowerCase().includes('premium monthly') || plan.planId === 2 || plan.planId === 3,
              lifetimePrice: `$${plan.price.toFixed(2)}`,
              monthlyPrice: `$${plan.price.toFixed(2)}`
            }));
            this.membershipPlans.set(plans);
          }
        },
        error: (err) => {
          console.error('Error loading membership plans:', err);
        }
      });
  }

  getPlanFeatures(plan: any): string[] {
    const features: string[] = [];
    
    if (plan.membershipTypeName) {
      features.push(`${plan.membershipTypeName} Notifications`);
    } else {
      features.push(`Standard Notifications`);
    }
    
    if (plan.credits !== undefined && plan.credits !== null) {
      features.push(`${plan.credits} Alerts per Month`);
      features.push('1 Tag');
    }

    if (plan.validityDays !== undefined && plan.validityDays !== null) {
      features.push(`${plan.validityDays} Days Validity Period`);
    }

    if (features.length === 0) {
      return ['Active Vehicle Protection', 'Alert scan notification'];
    }
    return features;
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
      question: 'What is TRAFFTAG?',
      answer: 'TRAFFTAG is a scannable QR tag system that allows anyone to contact you anonymously regarding your vehicle, pet, home, or belongings without seeing your personal phone number.',
      open: true
    },
    {
      question: 'Is my personal contact information visible to public scanners?',
      answer: 'No! Your privacy is protected. Every scan routes through TRAFFTAG\'s secure system, keeping your phone number completely hidden.',
      open: false
    },
    {
      question: 'How do I get notified?',
      answer: 'You can choose to receive instant alerts via Email, SMS, or WhatsApp whenever someone scans your tag.',
      open: false
    }
  ]);

  whyFeatures = [
    { label: 'We Never Share Your Phone Number', icon: 'fa-solid fa-lock' },
    { label: 'Anonymous • Secure • Trusted by Thousands', icon: 'fa-solid fa-shield-halved' },
    { label: 'Made with ❤️ for Safety & Peace of Mind', icon: 'fa-solid fa-heart' }
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

    membershipPlans = signal<any[]>([]);

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

  // Universal Smart QR Tags for Everyone & Every Need (Official Decal Poster Cards)
    ecosystemTags = signal([
    {
      category: 'MY HAPPY VEHICLE TAG',
      subtitle: 'Cars • SUVs • Trucks',
      subtitle2: 'Bikes & More',
      icon: 'fa-solid fa-car',
      image: 'maybach-tag.png',
      buttonText: 'PROTECT YOUR RIDE',
      link: '/tags/vehicle',
      colorClass: 'color-vehicle'
    },
    {
      category: 'MY HAPPY PET TAG',
      subtitle: 'Dogs • Cats • Birds',
      subtitle2: 'All Pets',
      icon: 'fa-solid fa-paw',
      image: 'card_pet_new.jpg',
      buttonText: 'KEEP THEM SAFE',
      link: '/tags/pet',
      colorClass: 'color-pet'
    },
    {
      category: 'MY HAPPY HOME TAG',
      subtitle: 'House • Apartment',
      subtitle2: 'Office • Shops',
      icon: 'fa-solid fa-house',
      image: 'card_home_new.jpg',
      buttonText: 'FOR YOUR PROPERTY',
      link: '/tags/home',
      colorClass: 'color-home'
    },
    {
      category: 'MY HAPPY LIFE TAG',
      subtitle: 'Adults • College Students • Seniors',
      subtitle2: '',
      icon: 'fa-solid fa-users',
      image: 'card_life_adults.jpg',
      buttonText: 'FOR EVERY PERSON',
      link: '/tags/life',
      colorClass: 'color-life'
    },
    {
      category: 'MY HAPPY ITEMS TAG',
      subtitle: 'Keys • Phone • Laptop',
      subtitle2: 'Wallet & More',
      icon: 'fa-solid fa-tag',
      image: 'card_items_new.jpg',
      buttonText: 'FOR YOUR BELONGINGS',
      link: '/tags/items',
      colorClass: 'color-items'
    }
  ]);

  // Real-Time Alert Benefits & Protection Scenarios
  keyAlertBenefits = signal([
    {
      id: 'parking-alerts',
      icon: 'fa-solid fa-car',
      badge: 'PARKING NOTIFICATIONS',
      title: 'Parking & Access Alerts',
      desc: 'If your vehicle is blocking a driveway or access point, nearby citizens can scan your QR tag to send an instant alert so you can move your vehicle.',
      tag: 'COMMUNITY ALERTS',
      accentColor: '#F59E0B',
      image: 'card-vehicle.png'
    },
    {
      id: 'headlights-windows',
      icon: 'fa-solid fa-lightbulb',
      badge: 'VEHICLE NOTIFICATIONS',
      title: 'Headlights & Windows',
      desc: 'Passersby or neighbors can notify you instantly if your headlights were left ON, a car window is open, or if your vehicle needs attention.',
      tag: 'HELPFUL ALERTS',
      accentColor: '#10B981',
      image: 'hero-car-bg-5.jpg'
    },
    {
      id: 'lost-found',
      icon: 'fa-solid fa-paw',
      badge: 'LOST & FOUND',
      title: 'Lost Pets & Belongings',
      desc: 'If someone finds your lost pet or belongings, they can instantly contact you to arrange their return without seeing your phone number.',
      tag: 'RECOVERY ALERTS',
      accentColor: '#EF4444',
      image: 'card-pet.png'
    },
    {
      id: 'privacy-shield',
      icon: 'fa-solid fa-lock',
      badge: '100% CONFIDENTIAL',
      title: 'Complete Privacy Protection',
      desc: 'Anyone scanning your tag can send alerts through TRAFFTAG\'s secure system. Your personal phone number remains completely hidden.',
      tag: 'ZERO NUMBER DISCLOSURE',
      accentColor: '#0284C7',
      image: 'card_home_new.jpg'
    }
  ]);

  scrollPricing(direction: 'left' | 'right') {
    const container = document.getElementById('pricing-slider-track');
    if (container) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}










