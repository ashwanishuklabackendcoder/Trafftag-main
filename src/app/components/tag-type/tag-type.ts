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
