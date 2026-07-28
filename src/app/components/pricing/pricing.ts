import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-pricing',
  imports: [RouterLink, NavbarComponent],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class Pricing {
  isMenuOpen = signal(false);

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
}
