import { FooterComponent } from '../footer/footer';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

import { HttpClient } from '@angular/common/http';
import { inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-pricing',
  imports: [FooterComponent, RouterLink, NavbarComponent],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class Pricing implements OnInit {
  isMenuOpen = signal(false);
  http = inject(HttpClient);
  dynamicPlans = signal<any[]>([]);

  ngOnInit() {
    this.http.get<{success: boolean, data: any[]}>('http://localhost:5000/api/v1/memberships/plans')
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

  membershipPlans = signal<any[]>([
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
}


