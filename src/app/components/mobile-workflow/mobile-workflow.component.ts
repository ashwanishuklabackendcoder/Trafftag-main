import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface GuideStep {
  id: number;
  stepNum: number;
  title: string;
  subtext: string;
  type: string;
  badgeColor?: string;
}

@Component({
  selector: 'app-mobile-workflow',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mobile-workflow.component.html',
  styleUrls: ['./mobile-workflow.component.css']
})
export class MobileWorkflowComponent {
  // Tab toggle: 'online' | 'physical' | 'finder' | 'both'
  activeGuideMode = signal<'online' | 'physical' | 'finder' | 'both'>('finder');
  
  // Mobile slider active index (for small screens)
  mobileStepIndex = signal<number>(0);

  // Poster lightbox modal
  showPosterModal = signal<boolean>(false);

  finderSteps: GuideStep[] = [
    {
      id: 1,
      stepNum: 1,
      title: 'Scan QR with Phone',
      subtext: 'Open smartphone camera, point at the TRAFFTAG QR code on the vehicle. No app required.',
      type: 'finder-scan'
    },
    {
      id: 2,
      stepNum: 2,
      title: 'Redirect to Scan Page',
      subtext: 'Instantly redirects to the secure Report Issue page. Tag ID and nickname are verified.',
      type: 'finder-redirect'
    },
    {
      id: 3,
      stepNum: 3,
      title: 'Open Issue Dropdown',
      subtext: 'Click "Please Tell Us What Happened?" to open the available alert categories.',
      type: 'finder-dropdown'
    },
    {
      id: 4,
      stepNum: 4,
      title: 'Select Appropriate Violation',
      subtext: 'Choose the exact violation (e.g., Blocking Driveway, No Parking, Delivery, etc.).',
      type: 'finder-select-issue'
    },
    {
      id: 5,
      stepNum: 5,
      title: 'Enter Location & Details',
      subtext: 'Type the location (e.g., New York Queen City) and optional extra details.',
      type: 'finder-details'
    },
    {
      id: 6,
      stepNum: 6,
      title: 'Fill Human Verification',
      subtext: 'Solve the quick math challenge (e.g. 6 + 2 = 8) to verify human submission.',
      type: 'finder-captcha'
    },
    {
      id: 7,
      stepNum: 7,
      title: 'Click "Notify Account Holder"',
      subtext: 'Tap the gold button. Your phone number & identity stay completely 100% private.',
      type: 'finder-submit'
    },
    {
      id: 8,
      stepNum: 8,
      title: 'Alert Sent Successfully!',
      subtext: 'Success message displays! The owner receives instant SMS & Email to resolve the issue.',
      type: 'finder-success'
    }
  ];

  onlineSteps: GuideStep[] = [
    {
      id: 1,
      stepNum: 1,
      title: 'Create Account',
      subtext: 'Go to trafftag.com. Create a free account, fill details and check all boxes.',
      type: 'register'
    },
    {
      id: 2,
      stepNum: 2,
      title: 'Verify Email (OTP)',
      subtext: 'OTP will come ONLY to your email. Open your email and enter the 6-digit code.',
      type: 'otp'
    },
    {
      id: 3,
      stepNum: 3,
      title: 'Sign In Again',
      subtext: 'After verifying OTP, login again with your email and password.',
      type: 'login'
    },
    {
      id: 4,
      stepNum: 4,
      title: 'Dashboard (First Screen)',
      subtext: 'After login, you will see your Dashboard.',
      type: 'dashboard'
    },
    {
      id: 5,
      stepNum: 5,
      title: 'Open Menu (3 Lines)',
      subtext: 'Click the 3 lines (≡) on the top left corner to open the menu.',
      type: 'menu-open'
    },
    {
      id: 6,
      stepNum: 6,
      title: 'Choose Plan & Pay',
      subtext: 'Select your membership plan and complete the payment.',
      type: 'choose-plan'
    },
    {
      id: 7,
      stepNum: 7,
      title: 'Go to My Vehicles',
      subtext: 'From the menu, click "My Vehicles".',
      type: 'menu-vehicles'
    },
    {
      id: 8,
      stepNum: 8,
      title: 'Register Vehicle',
      subtext: 'Enter your vehicle details and click "Save Vehicle".',
      type: 'register-vehicle'
    },
    {
      id: 9,
      stepNum: 9,
      title: 'Go to Download QR Tags',
      subtext: 'From the menu, click "Download QR Tags".',
      type: 'menu-download-tag'
    },
    {
      id: 10,
      stepNum: 10,
      title: 'Download Your Tag',
      subtext: 'Click "TRAFFTAG Download" to get your unique QR sticker.',
      type: 'download-tag'
    },
    {
      id: 11,
      stepNum: 11,
      title: 'Downloaded Tag (Example)',
      subtext: 'Your sticker will download with a new unique serial number. Print it.',
      type: 'decal-card'
    },
    {
      id: 12,
      stepNum: 12,
      title: 'Print & Place on Vehicle',
      subtext: 'Print the sticker and stick it on your vehicle (inside windshield).',
      type: 'place-on-vehicle'
    }
  ];

  physicalSteps: GuideStep[] = [
    {
      id: 1,
      stepNum: 1,
      title: 'Create Account',
      subtext: 'Go to trafftag.com. Create a free account, fill details and check all boxes. Click "Yes, Sign Me Up!".',
      type: 'register'
    },
    {
      id: 2,
      stepNum: 2,
      title: 'Verify Email (OTP)',
      subtext: 'OTP will come ONLY to your email. Open your email and enter the 6-digit code.',
      type: 'otp'
    },
    {
      id: 3,
      stepNum: 3,
      title: 'Sign In Again',
      subtext: 'After verifying OTP, login again with your email and password.',
      type: 'login'
    },
    {
      id: 4,
      stepNum: 4,
      title: 'Dashboard',
      subtext: 'You will see your Dashboard.',
      type: 'dashboard'
    },
    {
      id: 5,
      stepNum: 5,
      title: 'Open Menu (3 Lines)',
      subtext: 'Click the 3 lines (≡) on the top left corner to open the menu.',
      type: 'menu-open'
    },
    {
      id: 6,
      stepNum: 6,
      title: 'Go to My Vehicles',
      subtext: 'From the menu, click "My Vehicles".',
      type: 'menu-vehicles'
    },
    {
      id: 7,
      stepNum: 7,
      title: 'Register Vehicle',
      subtext: 'Enter your vehicle details and click "Save Vehicle".',
      type: 'register-vehicle'
    },
    {
      id: 8,
      stepNum: 8,
      title: 'Go to Download QR Tags',
      subtext: 'From the menu, click "Download QR Tags".',
      type: 'menu-download-tag'
    },
    {
      id: 9,
      stepNum: 9,
      title: 'Activate Physical Tag',
      subtext: 'Click "Link and Activate Physical TRAFFTAG".',
      type: 'activate-physical-choice'
    },
    {
      id: 10,
      stepNum: 10,
      title: 'Enter Serial Number',
      subtext: 'Enter the serial number printed on your sticker and click "Activate Tag".',
      type: 'enter-serial'
    },
    {
      id: 11,
      stepNum: 11,
      title: 'Tag Activated',
      subtext: 'You will see a confirmation message that your tag is activated.',
      type: 'tag-activated'
    },
    {
      id: 12,
      stepNum: 12,
      title: 'Place on Vehicle',
      subtext: 'Your preprinted sticker is now active. Stick it on your vehicle (inside windshield).',
      type: 'place-physical-vehicle'
    }
  ];

  setMode(mode: 'online' | 'physical' | 'finder' | 'both') {
    this.activeGuideMode.set(mode);
    this.mobileStepIndex.set(0);
  }

  nextMobileStep(maxSteps: number) {
    if (this.mobileStepIndex() < maxSteps - 1) {
      this.mobileStepIndex.update(i => i + 1);
    } else {
      this.mobileStepIndex.set(0);
    }
  }

  prevMobileStep(maxSteps: number) {
    if (this.mobileStepIndex() > 0) {
      this.mobileStepIndex.update(i => i - 1);
    } else {
      this.mobileStepIndex.set(maxSteps - 1);
    }
  }

  openPosterModal() {
    this.showPosterModal.set(true);
  }

  closePosterModal() {
    this.showPosterModal.set(false);
  }
}
