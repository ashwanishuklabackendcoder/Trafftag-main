import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

export interface TagData {
  title: string;
  subtitle: string;
  bannerImage: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-tag-type',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './tag-type.html',
  styleUrl: './tag-type.css'
})
export class TagType implements OnInit {
  tagType: string = '';
  tagData: TagData | null = null;

  private tagDataMap: Record<string, TagData> = {
    'vehical': {
      title: 'Vehicle Protection Tag',
      subtitle: 'Keep your car, truck, or SUV safe with instant alerts.',
      bannerImage: '/banner-vehical.png',
      description: 'Our Vehicle Protection Tag offers unmatched security. Whether parked in a busy city or at home, passersby can alert you of open windows, parking issues, or damage—without ever seeing your phone number.',
      features: [
        'Instant SMS & WhatsApp Alerts',
        '100% Number Masking Privacy',
        'Weatherproof & Durable Decal',
        'Easy Setup & Activation'
      ]
    },
    'vehicle': {
      title: 'Vehicle Protection Tag',
      subtitle: 'Keep your car, truck, or SUV safe with instant alerts.',
      bannerImage: '/banner-vehical.png',
      description: 'Our Vehicle Protection Tag offers unmatched security. Whether parked in a busy city or at home, passersby can alert you of open windows, parking issues, or damage—without ever seeing your phone number.',
      features: [
        'Instant SMS & WhatsApp Alerts',
        '100% Number Masking Privacy',
        'Weatherproof & Durable Decal',
        'Easy Setup & Activation'
      ]
    },
    'pet': {
      title: 'Pet Protection Tag',
      subtitle: 'Keep your furry and feathered friends safe.',
      bannerImage: '/banner-pet.jpg',
      description: 'Our Pet Protection Tag ensures anyone who finds your lost pet can instantly notify you while keeping your phone number completely private.',
      features: [
        'Instant Location Scan Alerts',
        '100% Number Masking Privacy',
        'Waterproof Collar Tag',
        'No Batteries Required'
      ]
    },
    'home': {
      title: 'Home Protection Tag',
      subtitle: 'Secure your property and entrance gates.',
      bannerImage: '/banner-home.jpg',
      description: 'Place the Home Protection Tag on your main gate or door. Delivery agents or visitors can alert you instantly without needing your direct contact details.',
      features: [
        'Instant Delivery & Visitor Alerts',
        'Total Privacy & Security',
        'Weather-Resistant Decal',
        'Quick Setup'
      ]
    },
    'life': {
      title: 'Life Protection Tag',
      subtitle: 'Safety for kids, students, and seniors.',
      bannerImage: '/banner-life.jpg',
      description: 'The Life Protection Tag gives your loved ones an easy way to carry emergency contact info. In an emergency, first responders or helpful strangers can instantly alert you.',
      features: [
        'Emergency SOS Contact',
        'Medical Info Access',
        'Durable ID Cards',
        'Peace of Mind'
      ]
    },
    'items': {
      title: 'Items Protection Tag',
      subtitle: 'Never lose your keys, laptop, or luggage.',
      bannerImage: '/banner-vehical.png',
      description: 'Attach this tag to your valuable belongings. If lost, the finder can scan it to coordinate a safe return, all while your personal identity remains protected.',
      features: [
        'Lost & Found Tracking',
        'Privacy Assured',
        'Adhesive & Keychain Options',
        'Global Coverage'
      ]
    }
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tagType = params.get('type') || '';
      this.loadTagData();
    });
  }

  loadTagData(): void {
    const key = this.tagType.toLowerCase();
    if (this.tagDataMap[key]) {
      this.tagData = this.tagDataMap[key];
    } else {
      // Default fallback
      this.tagData = {
        title: 'TRAFFTAG Universal Tag',
        subtitle: 'Protect what matters most.',
        bannerImage: '/banner-vehical.png',
        description: 'Discover our complete range of smart QR tags designed to keep your belongings and loved ones safe.',
        features: ['Smart Tracking', 'Instant Alerts', 'Privacy Protection']
      };
    }
  }
}
