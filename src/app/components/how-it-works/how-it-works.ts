import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './how-it-works.html',
  styleUrls: ['./how-it-works.css']
})
export class HowItWorks {
  isMenuOpen = signal(false);
  activeTab = signal<'scan' | 'alert' | 'challan'>('scan');

  steps = [
    {
      stepNumber: '01',
      title: 'Affix Decal Tag',
      subtitle: 'Instant Placement',
      description: 'Stick the weather-proof, tamper-evident TRAFFTAG QR Decal on your taxi windshield or bumper.',
      icon: 'fa-solid fa-qrcode',
      badge: 'Step 1'
    },
    {
      stepNumber: '02',
      title: 'Scan Decal Tag',
      subtitle: 'Zero App Needed',
      description: 'Any public user, passenger, or traffic officer scans the QR tag using any smartphone camera.',
      icon: 'fa-solid fa-camera-retro',
      badge: 'Step 2'
    },
    {
      stepNumber: '03',
      title: 'Anonymous SOS Alert',
      subtitle: 'Masked Privacy Protection',
      description: 'Instantly notify the driver via SMS, Email, or WhatsApp without revealing personal phone numbers.',
      icon: 'fa-solid fa-shield-halved',
      badge: 'Step 3'
    },
    {
      stepNumber: '04',
      title: 'E-Challan & Fleet Sync',
      subtitle: 'Zero Downtime Settlement',
      description: 'Check official traffic violations, pay fines in one click, and maintain complete fleet compliance.',
      icon: 'fa-solid fa-file-invoice-dollar',
      badge: 'Step 4'
    }
  ];

  techPillars = [
    {
      title: '256-Bit Masked Privacy',
      desc: 'Owner contact details remain 100% encrypted. Public scanners only access safety options.',
      icon: 'fa-solid fa-lock-keyhole'
    },
    {
      title: 'Instant E-Challan Sync',
      desc: 'Direct integration with official traffic portals for real-time fine alerts.',
      icon: 'fa-solid fa-bolt'
    },
    {
      title: 'Passenger Safety SOS',
      desc: 'Passengers can trigger emergency safety alerts with vehicle location sharing.',
      icon: 'fa-solid fa-heart-pulse'
    },
    {
      title: 'Fleet Control Hub',
      desc: 'Manage bulk QR decals, monitor violation reports, and track cab fleet status.',
      icon: 'fa-solid fa-sliders'
    }
  ];

  setActiveTab(tab: 'scan' | 'alert' | 'challan') {
    this.activeTab.set(tab);
  }
}
