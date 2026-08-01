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
      cardImage: 'slider1.png',
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

  // Universal Smart QR Tags for Everyone & Every Need (Official Decal Poster Cards)
  ecosystemTags = signal([
    {
      category: 'VEHICLE TAG',
      title: 'Vehicle & Cab Protection',
      subtitle: 'Cars, Bikes, Cabs & Auto Rickshaws',
      desc: 'Protect your vehicle from illegal parking fines, towing, blocked driveways, or accidental damage with instant masked owner dispatch.',
      icon: 'fa-solid fa-car',
      decalIcon: 'fa-solid fa-car-side',
      image: 'card-vehicle-transparent.png',
      shieldLogo: 'logo-shield-vehicle.png',
      badge: 'PARKING & CHALLAN GUARD',
      badgeColor: 'amber',
      posterTitlePrefix: 'GET YOUR ',
      posterTitleHighlight: 'TRAFFTAG™',
      posterTitleMiddle: ' TODAY FOR YOUR ',
      posterTitleEnd: 'VEHICLE',
      posterMottoPrefix: 'OR RISK GETTING ANOTHER PARKING TICKET — ',
      posterMottoHighlight: 'YOUR CHOICE 😊',
      posterBanner: 'LESS PARKING STRESS • ZERO CHALLAN WORRY',
      posterFeatures: [
        { icon: 'fa-solid fa-bell', text: 'Parking & Challan Alerts' },
        { icon: 'fa-solid fa-truck-towed', text: 'Towing Prevention Dispatch' },
        { icon: 'fa-solid fa-triangle-exclamation', text: 'Vehicle Damage Warnings' },
        { icon: 'fa-solid fa-broom', text: 'Road Sweeping Alerts' },
        { icon: 'fa-solid fa-lock', text: '100% Masked Phone Privacy' }
      ],
      features: ['Avoid Parking Challans', 'Road Sweeping Alerts', 'Vehicle Damage Report']
    },
    {
      category: 'PET TAG',
      title: 'Lovely Pet Smart Tags',
      subtitle: 'Dogs, Cats, Birds & Domestic Pets',
      desc: 'They don’t have a voice, but TRAFFTAG does! Instant scan to contact owner if your pet strays or gets lost without revealing your phone number.',
      icon: 'fa-solid fa-paw',
      decalIcon: 'fa-solid fa-paw',
      image: 'card-pet-transparent.png',
      shieldLogo: 'logo-shield-pet.png',
      badge: 'LOST PET RECOVERY',
      badgeColor: 'emerald',
      posterTitlePrefix: 'GET YOUR ',
      posterTitleHighlight: 'TRAFFTAG™',
      posterTitleMiddle: ' TODAY FOR YOUR ',
      posterTitleEnd: 'LOVELY PET 🐾',
      posterMottoPrefix: 'THEY DON’T HAVE VOICE BUT ',
      posterMottoHighlight: 'TRAFFTAG™ DOES ❤',
      posterBanner: 'LESS PET STRESS • INSTANT GPS LOCATION',
      posterFeatures: [
        { icon: 'fa-solid fa-phone-volume', text: 'Masked Owner Call' },
        { icon: 'fa-solid fa-location-dot', text: 'Instant GPS Location Drop' },
        { icon: 'fa-solid fa-shield-cat', text: 'Waterproof Collar Tag' },
        { icon: 'fa-solid fa-notes-medical', text: 'Pet Vet & Medical Profile' },
        { icon: 'fa-solid fa-heart', text: '24/7 Citizen Helper Dispatch' }
      ],
      features: ['Masked Owner Call', 'Instant GPS Location Drop', 'Waterproof QR Collar Tag']
    },
    {
      category: 'HOME TAG',
      title: 'Home & Property Gate Tags',
      subtitle: 'Independent Houses, Gated Flats & Villas',
      desc: 'Every house is a home! Never miss delivery drivers, visitors, emergency alerts, or neighborhood maintenance notices even when away from home.',
      icon: 'fa-solid fa-house-user',
      decalIcon: 'fa-solid fa-house-flag',
      image: 'card-home-transparent.png',
      shieldLogo: 'logo-shield-home.png',
      badge: 'DIGITAL GATE DOORBELL',
      badgeColor: 'indigo',
      posterTitlePrefix: 'GET YOUR ',
      posterTitleHighlight: 'TRAFFTAG™',
      posterTitleMiddle: ' TODAY FOR YOUR ',
      posterTitleEnd: 'HOME 🏠',
      posterMottoPrefix: 'EVERY HOUSE IS A ',
      posterMottoHighlight: 'HOME ❤',
      posterBanner: 'LESS WORRY • MORE SECURITY • MORE PEACE ❤',
      posterFeatures: [
        { icon: 'fa-solid fa-box-open', text: 'Delivery Package Alerts' },
        { icon: 'fa-solid fa-user-check', text: 'Visitor Contact Relay' },
        { icon: 'fa-solid fa-bell-concierge', text: 'Digital Gate Doorbell' },
        { icon: 'fa-solid fa-wrench', text: 'Maintenance Dispatch' },
        { icon: 'fa-solid fa-shield-halved', text: 'Neighborhood Safety' }
      ],
      features: ['Delivery Dispatch Alert', 'Visitor Contact Relay', 'Neighborhood Safety']
    },
    {
      category: 'KIDS TAG',
      title: 'Child & School Bag Safety',
      subtitle: 'School Bags, Backpacks & Field Trips',
      desc: 'Ensure instant parent emergency contact during school commutes, field trips, or lost bag recovery with confidential QR tags.',
      icon: 'fa-solid fa-child-reaching',
      decalIcon: 'fa-solid fa-child-dress',
      image: 'card-kids.png',
      shieldLogo: 'logo-shield-kids.png',
      badge: 'KID SAFETY SHIELD',
      badgeColor: 'rose',
      posterTitlePrefix: 'GET YOUR ',
      posterTitleHighlight: 'TRAFFTAG™',
      posterTitleMiddle: ' TODAY FOR YOUR ',
      posterTitleEnd: 'CHILD 🎒',
      posterMottoPrefix: 'EVERY CHILD DESERVES A ',
      posterMottoHighlight: '24/7 SAFETY SHIELD ⭐',
      posterBanner: 'SAFE SCHOOL COMMUTE • CONFIDENTIAL PARENT SOS',
      posterFeatures: [
        { icon: 'fa-solid fa-hospital-user', text: 'Parent SOS Emergency Relay' },
        { icon: 'fa-solid fa-briefcase', text: 'Instant Bag Recovery' },
        { icon: 'fa-solid fa-file-medical', text: 'Confidential Medical Info' },
        { icon: 'fa-solid fa-bus', text: 'School Bus Commute Shield' },
        { icon: 'fa-solid fa-lock', text: 'Zero Parent Number Exposure' }
      ],
      features: ['Parent SOS Trigger', 'Instant Bag Recovery', 'Confidential Medical Info']
    },
    {
      category: 'SENIOR TAG',
      title: 'Senior Citizens & Medical ID',
      subtitle: 'Elderly Family Members & Care Lanyards',
      desc: 'Provides immediate access to emergency family contacts and critical medical profiles if an elderly loved one needs help or gets lost.',
      icon: 'fa-solid fa-person-cane',
      decalIcon: 'fa-solid fa-hand-holding-medical',
      image: 'card-senior.png',
      shieldLogo: 'logo-shield-senior.png',
      badge: 'SENIOR CARE ASSIST',
      badgeColor: 'purple',
      posterTitlePrefix: 'GET YOUR ',
      posterTitleHighlight: 'TRAFFTAG™',
      posterTitleMiddle: ' TODAY FOR ',
      posterTitleEnd: 'SENIOR CITIZENS 👵',
      posterMottoPrefix: 'ALWAYS PROTECTED — ',
      posterMottoHighlight: 'CARE AT EVERY STEP ❤',
      posterBanner: 'SENIOR CARE ASSIST • ONE-TAP EMERGENCY HELP',
      posterFeatures: [
        { icon: 'fa-solid fa-phone-flip', text: 'Family Emergency Relay' },
        { icon: 'fa-solid fa-notes-medical', text: 'Critical Health & Blood Group' },
        { icon: 'fa-solid fa-person-shelter', text: 'Lost Elder Assistance' },
        { icon: 'fa-solid fa-kit-medical', text: 'First Responder Medical ID' },
        { icon: 'fa-solid fa-heart-pulse', text: 'Instant Family Notification' }
      ],
      features: ['Emergency Contact Relay', 'Critical Medical Info', 'One-Tap Assistance']
    }
  ]);

  // Real-Time Alert Benefits & Protection Scenarios
  keyAlertBenefits = signal([
    {
      id: 'challan-prevention',
      icon: 'fa-solid fa-shield-halved',
      badge: 'SAVE UP TO ₹2,000+',
      title: 'Avoid Traffic Fines & Towing (Challan Katne Se Bachein)',
      desc: 'If your vehicle is blocking a driveway or parked in a restricted zone, nearby citizens scan your QR tag to send an instant SMS/WhatsApp alert so you can move your vehicle before police issue a fine or tow truck arrives.',
      tag: 'CHALLAN PREVENTION',
      accentColor: '#F59E0B',
      image: 'card-vehicle.png'
    },
    {
      id: 'road-cleaning',
      icon: 'fa-solid fa-broom',
      badge: 'CLEAN & DAMAGE FREE',
      title: 'Road Sweeping & Debris Warning',
      desc: 'Get notified immediately when municipal road cleaning, street painting, or tree trimming is happening on your road so you can move your vehicle before it gets dirty, scratched, or covered in dust.',
      tag: 'DIRT & DUST ALERTS',
      accentColor: '#10B981',
      image: 'hero-car-bg-5.jpg'
    },
    {
      id: 'damage-alert',
      icon: 'fa-solid fa-triangle-exclamation',
      badge: 'INSTANT CITIZEN ALERTS',
      title: 'Vehicle Damage & Emergency Alerts (Kuch Nukshan Ho Gya H)',
      desc: 'Passersby or neighbors can notify you instantly if your headlights were left ON, car window is open, tire is flat, or if your vehicle was accidentally bumped or damaged.',
      tag: 'DAMAGE REPORTING',
      accentColor: '#EF4444',
      image: 'hero-car-bg-1.jpg'
    },
    {
      id: 'privacy-shield',
      icon: 'fa-solid fa-lock',
      badge: '100% CONFIDENTIAL',
      title: 'Masked Contact Privacy Guarantee',
      desc: 'Anyone scanning your tag can call or send alerts through TRAFFTAG’s secure gateway without seeing your personal phone number. Zero risk of spam, leaks, or harassment.',
      tag: 'ZERO NUMBER DISCLOSURE',
      accentColor: '#0284C7',
      image: 'card-pet.png'
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
