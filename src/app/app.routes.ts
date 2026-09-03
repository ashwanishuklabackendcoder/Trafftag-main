import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';

import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload && typeof payload.exp === 'number') {
      return payload.exp < (Date.now() / 1000);
    }
  } catch (e) {}
  return true;
};

const authGuard = (): boolean | UrlTree => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  if (token && !isTokenExpired(token)) {
    return true;
  }
  localStorage.removeItem('accessToken');
  return router.parseUrl('/login');
};

const adminGuard = (): boolean | UrlTree => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  if (token && !isTokenExpired(token)) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role;
      if (role === 'Administrator' || role === 'Admin') {
        return true;
      }
    } catch (e) {}
  }
  localStorage.removeItem('accessToken');
  return router.parseUrl('/login');
};

export const routes: Routes = [
  { path: '', component: Home, title: 'TRAFFTAG – Anonymous QR Alerts for Vehicles, Pets, Homes & More' },
  { path: 'how-it-works', loadComponent: () => import('./components/how-it-works/how-it-works').then(c => c.HowItWorks), title: 'How TRAFFTAG Works | Anonymous QR Alerts in 4 Steps' },
  { path: 'features', loadComponent: () => import('./components/features/features').then(c => c.Features), title: 'TRAFFTAG Features | Anonymous Alerts, Multi-Channel Notifications' },
  { path: 'pricing', loadComponent: () => import('./components/pricing/pricing').then(c => c.Pricing), title: 'Pricing & Protection Plans | TRAFFTAG Safety Services' },
  { path: 'faq', loadComponent: () => import('./components/faq/faq').then(c => c.Faq), title: 'TRAFFTAG FAQ | Common Questions About QR Alerts & Privacy' },
  { path: 'about', loadComponent: () => import('./components/about/about').then(c => c.About), title: 'About TRAFFTAG | Anonymous QR Alerts for Vehicles, Pets & Homes' },
  { path: 'contact', loadComponent: () => import('./components/contact/contact').then(c => c.Contact), title: 'Contact Us | TRAFFTAG Anonymous QR Alerts' },
  { path: 'privacy-policy', loadComponent: () => import('./components/privacy-policy/privacy-policy').then(c => c.PrivacyPolicy), title: 'Privacy Policy | TRAFFTAG Safety Services' },
  { path: 'terms-of-service', loadComponent: () => import('./components/terms-of-service/terms-of-service').then(c => c.TermsOfService), title: 'Terms of Service | TRAFFTAG Legal' },
  { path: 'refund-cancellation', loadComponent: () => import('./components/refund-cancellation/refund-cancellation').then(c => c.RefundCancellation), title: 'Refund & Cancellation Policy | TRAFFTAG' },
  { path: 'shipping-replacement', loadComponent: () => import('./components/shipping-replacement/shipping-replacement').then(c => c.ShippingReplacement), title: 'Shipping & Replacement Policy | TRAFFTAG' },
  { path: 'disclaimers', loadComponent: () => import('./components/disclaimers/disclaimers').then(c => c.Disclaimers), title: 'Disclaimers | TRAFFTAG Legal' },
  { path: 'consent-tracking', loadComponent: () => import('./components/consent-tracking/consent-tracking').then(c => c.ConsentTracking), title: 'Consent & Tracking | TRAFFTAG Privacy' },
  { path: 'tags/:type', loadComponent: () => import('./components/tag-type/tag-type').then(c => c.TagType), title: 'Smart Tags | TRAFFTAG' },
  { path: 'login', component: Login, title: 'Sign In | TRAFFTAG Customer Portal' },
  { path: 'register', loadComponent: () => import('./components/register/register').then(c => c.Register), title: 'Create Account | TRAFFTAG Safety Registry' },
  { path: 'verify-otp', loadComponent: () => import('./components/verify-otp/verify-otp').then(c => c.VerifyOtp), title: 'Verify OTP Code | TRAFFTAG Security' },
  { path: 'portal', redirectTo: 'portal/dashboard', pathMatch: 'full' },
  { path: 'portal/:subpage', loadComponent: () => import('./components/portal/portal').then(c => c.Portal), title: 'Customer Dashboard | TRAFFTAG Portal', canActivate: [authGuard] },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/:subpage', loadComponent: () => import('./components/admin/admin').then(c => c.Admin), title: 'Administrator Control Panel | TRAFFTAG Console', canActivate: [adminGuard] },
  { path: 'scan', loadComponent: () => import('./components/scan/scan').then(c => c.Scan), title: 'Decal Scanning Gateway | TRAFFTAG Alert' },
  { path: 'scan/:tagId', loadComponent: () => import('./components/scan/scan').then(c => c.Scan), title: 'Scan Decal Tag | TRAFFTAG Anonymous Notification' },
  { path: '**', redirectTo: '' }
];

