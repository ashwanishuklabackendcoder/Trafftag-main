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

export interface ViolationScenario {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  signText: string;
  icon: string;
  image: string;
  riskSummary: string;
  problem: string;
  howTrafftagHelps: string;
  actionTip: string;
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
        'Instant SMS & Email Alerts',
        '100% Number Masking Privacy',
        'QR Decal',
        'Easy Setup & Activation'
      ]
    },
    'vehicle': {
      title: 'Vehicle Protection Tag',
      subtitle: 'Keep your car, truck, or SUV safe with instant alerts.',
      bannerImage: '/banner-vehical.png',
      description: 'Our Vehicle Protection Tag offers unmatched security. Whether parked in a busy city or at home, passersby can alert you of open windows, parking issues, or damage—without ever seeing your phone number.',
      features: [
        'Instant SMS & Email Alerts',
        '100% Number Masking Privacy',
        'QR Decal',
        'Easy Setup & Activation'
      ]
    },
    'pet': {
      title: 'Pet Protection Tag',
      subtitle: 'Keep your furry and feathered friends safe.',
      bannerImage: '/banner-pet.jpg',
      description: 'Our Pet Protection Tag ensures anyone who finds your lost pet can instantly notify you while keeping your phone number completely private.',
      features: [
        'Instant Scan Alerts',
        '100% Number Masking Privacy',
        'Collar Tag',
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
        'QR Decal',
        'Quick Setup'
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
        description: 'Discover our complete range of smart QR tags designed to keep your vehicles, pets, and homes safe.',
        features: ['Smart Tracking', 'Instant Alerts', 'Privacy Protection']
      };
    }
  }

  violationScenarios: ViolationScenario[] = [
    {
      id: 'street-cleaning',
      title: 'Street Cleaning & Alternate Side Parking',
      badge: 'Street Sweeper Restriction',
      badgeColor: '#EF4444',
      signText: 'NO PARKING STREET CLEANING 7:30 AM - 9 AM MON & THU',
      icon: 'fa-solid fa-broom',
      image: '/violation-street-cleaning.png',
      riskSummary: 'Costly $65+ Parking Fine & City Towing',
      problem: 'City street sweepers move fast with traffic enforcement officers trailing right behind them. Forgetting alternate side parking schedules or misreading dense municipal signs results in instant tickets or surprise impounding.',
      howTrafftagHelps: 'A helpful neighbor, morning dog walker, or passerby spots your car parked during sweeping hours and scans your windshield decal. An instant SMS and email alert reaches your phone so you can move your vehicle before the sweeper or tow truck arrives.',
      actionTip: 'Move your car in time and avoid a $65+ ticket with a 2-minute courtesy alert from a friendly neighbor.'
    },
    {
      id: 'bus-stop',
      title: 'Bus Stop Zone & Dedicated Transit Lanes',
      badge: 'Bus Stop Restriction',
      badgeColor: '#2563EB',
      signText: 'BUS STOP ZONE',
      icon: 'fa-solid fa-bus',
      image: '/violation-bus-stop.png',
      riskSummary: '$115 - $250 Camera Summons & Rapid Towing',
      problem: 'Stopping or parking in front of a bus stop obstructs transit passengers, blocks wheelchair accessibility ramps, and triggers automated photo enforcement camera fines as well as priority municipal tow dispatch.',
      howTrafftagHelps: 'Waiting transit riders, bus operators, or pedestrians can quickly scan your decal. You receive an urgent alert to vacate the bus stop area immediately before enforcement officers or automated cameras issue violations.',
      actionTip: 'Clear the stop before the transit bus and municipal tow truck arrive.'
    },
    {
      id: 'double-parking',
      title: 'Double Parking & Traffic Lane Obstruction',
      badge: 'Traffic Lane Block',
      badgeColor: '#D97706',
      signText: 'NO DOUBLE PARKING / ACTIVE LANE',
      icon: 'fa-solid fa-road-barrier',
      image: '/violation-double-parking.png',
      riskSummary: 'Sideswipe Collision, Severe Road Rage & Summons',
      problem: 'Double parking chokes narrow streets, traps delivery trucks, and delays emergency responders. It frequently leads to angry horn blaring, clipped side mirrors, sideswipe damage, and heated confrontations.',
      howTrafftagHelps: 'Drivers behind your car or nearby residents scan your QR tag to send a courteous notification asking you to move. You can step outside and clear the roadway promptly without having to disclose your personal phone number.',
      actionTip: 'Resolve blocked traffic respectfully and privately without roadside confrontation.'
    },
    {
      id: 'blocked-driveway',
      title: 'Blocked Private Driveway or Residential Garage',
      badge: 'Driveway Access',
      badgeColor: '#7C3AED',
      signText: 'ACTIVE DRIVEWAY / DO NOT BLOCK',
      icon: 'fa-solid fa-warehouse',
      image: '/violation-blocked-driveway.png',
      riskSummary: 'Immediate 311 Complaint & $200+ Private Tow',
      problem: 'Carelessly or inadvertently parking across a residential driveway traps homeowners inside when heading to work, doctor visits, or school pick-ups, provoking immediate 311 complaints and private tow dispatches.',
      howTrafftagHelps: 'Instead of having your car ticketed and towed, the annoyed homeowner scans the decal on your windshield to alert you to come move your vehicle immediately, resolving the situation peacefully in minutes.',
      actionTip: 'Give homeowners an easy, non-confrontational way to alert you before they call a tow truck.'
    },
    {
      id: 'no-parking-anytime',
      title: 'No Parking Anytime & Tow-Away Zones',
      badge: 'Tow-Away Danger',
      badgeColor: '#DC2626',
      signText: 'NO PARKING ANYTIME',
      icon: 'fa-solid fa-ban',
      image: '/violation-no-parking.png',
      riskSummary: 'Immediate Tow-Away, Booting & Impound Lot Fees',
      problem: 'Parking in designated tow zones, near fire hydrants, or in temporary emergency construction zones carries zero-tolerance enforcement with instant hook-up towing and expensive lot recovery fees.',
      howTrafftagHelps: 'Fellow drivers and Good Samaritans noticing the violation scan your decal. You receive an immediate high-priority alert to rescue your car before it is hitched onto a flatbed tow truck.',
      actionTip: 'A quick scan by a Good Samaritan can save you hundreds of dollars in municipal impound retrieval fees.'
    },
    {
      id: 'commercial-loading',
      title: 'Commercial Vehicles Only & Loading Zones',
      badge: 'Commercial Loading Zone',
      badgeColor: '#EA580C',
      signText: 'COMMERCIAL VEHICLES ONLY LOADING ZONE 7 AM - 6 PM MON - FRI',
      icon: 'fa-solid fa-truck-ramp-box',
      image: '/violation-commercial-loading.png',
      riskSummary: '$95 - $115 Ticket & Impound Tow Risk',
      problem: 'Parking a passenger vehicle in a designated commercial loading zone during business hours blocks delivery trucks and freight couriers, triggering fast ticketing by parking agents and tow complaints by frustrated drivers.',
      howTrafftagHelps: 'Delivery drivers or passersby scan the QR decal on your windshield to send a polite alert asking you to move. You get notified right away so you can clear the spot before an enforcement officer issues a summons.',
      actionTip: 'Move your vehicle quickly before commercial drivers report your car or traffic agents arrive.'
    }
  ];

  isVehicleTag(): boolean {
    const key = (this.tagType || '').toLowerCase();
    return key === 'vehicle' || key === 'vehical';
  }
}





