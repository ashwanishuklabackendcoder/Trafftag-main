import { FooterComponent } from '../footer/footer';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

import { HttpClient } from '@angular/common/http';
import { inject, OnInit } from '@angular/core';
import { API_BASE_URL } from '../../config/api.config';

@Component({
  selector: 'app-pricing',
  imports: [FooterComponent, RouterLink, NavbarComponent],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class Pricing implements OnInit {
  isMenuOpen = signal(false);
  http = inject(HttpClient);
  membershipPlans = signal<any[]>([
    {
      id: 1,
      name: 'BASIC MONTHLY PLAN',
      lifetimePrice: '$39.99',
      monthlyPrice: '$39.99',
      price: 39.99,
      credits: 10,
      validityDays: 30,
      membershipTypeName: 'Email',
      featured: false,
      isDynamic: true
    },
    {
      id: 2,
      name: 'BASIC ANNUAL PLAN',
      lifetimePrice: '$439.00',
      monthlyPrice: '$439.00',
      price: 439.00,
      credits: 25,
      validityDays: 365,
      membershipTypeName: 'Email',
      featured: false,
      isDynamic: true
    },
    {
      id: 3,
      name: 'PREMIUM MONTHLY PLAN',
      lifetimePrice: '$49.99',
      monthlyPrice: '$49.99',
      price: 49.99,
      credits: 25,
      validityDays: 30,
      membershipTypeName: 'Email',
      featured: true,
      isDynamic: true
    },
    {
      id: 4,
      name: 'PREMIUM ANNUAL PLAN',
      lifetimePrice: '$550.00',
      monthlyPrice: '$550.00',
      price: 550.00,
      credits: 50,
      validityDays: 365,
      membershipTypeName: 'Email',
      featured: false,
      isDynamic: true
    }
  ]);

  ngOnInit() {
    this.http.get<{success: boolean, data: any[]}>(`${API_BASE_URL}/api/v1/memberships/plans`)
      .subscribe({
        next: (res) => {
          if(res.success && res.data && res.data.length > 0) {
            const mappedPlans = res.data.map((p: any) => ({
              id: p.planId,
              name: p.name.toUpperCase(),
              lifetimePrice: `${p.validityDays} Days`,
              monthlyPrice: `$${p.price.toFixed(2)}`,
              credits: p.credits,
              validityDays: p.validityDays,
              membershipTypeName: p.membershipTypeName,
              featured: false,
              isDynamic: true
            }));
            this.membershipPlans.set(mappedPlans);
          }
        },
        error: (err) => console.error('Error fetching dynamic plans', err)
      });
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  scrollPricing(direction: 'left' | 'right') {
    const track = document.getElementById('pricingTrack');
    if (track) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  

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
}




