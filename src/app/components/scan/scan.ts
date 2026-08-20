import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../config/api.config';

@Component({
  selector: 'app-scan',
  imports: [FormsModule, RouterLink],
  templateUrl: './scan.html',
  styleUrl: './scan.css',
})
export class Scan implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  tagId = signal('');
  manualTagInput = signal('');
  selectedCategory = signal('');
  searchQuery = signal('');
  dropdownOpen = signal(false);
  customMessage = signal('');
  contactNumber = signal('');
  
  // CAPTCHA
  num1 = signal(0);
  num2 = signal(0);
  userCaptcha = signal('');
  captchaError = signal(false);

  isSubmitting = signal(false);
  isSuccess = signal(false);
  errorMessage = signal('');

  // Location signals (Compulsory)
  latitude = signal('');
  longitude = signal('');
  isDetectingLocation = signal(false);
  locationStatusMessage = signal('');
  locationSuccess = signal(false);

  vehicleId = signal<number>(0);
  ownerUsername = signal<string>('Vehicle Owner');
  vehicleInfo = signal<string>('');

  categories = signal<any[]>([]);

  filteredCategories = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.categories();
    return this.categories().filter(c => c.label.toLowerCase().includes(q));
  });

  selectCategory(val: string, label: string) {
    this.selectedCategory.set(val);
    this.searchQuery.set(label);
    this.dropdownOpen.set(false);
  }

  onDropdownBlur() {
    // delay to allow mousedown on item to fire first
    setTimeout(() => {
      this.dropdownOpen.set(false);
      // Optional: reset search query to selected label if invalid
      const match = this.categories().find(c => c.value === this.selectedCategory());
      if (match) {
        this.searchQuery.set(match.label);
      } else {
        this.searchQuery.set('');
        this.selectedCategory.set('');
      }
    }, 200);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('tagId');
      if (id) {
        this.tagId.set(id);
        this.lookupTagDetails(id);
      }
    });
    this.generateCaptcha();
    this.detectLocation();
  }

  detectLocation() {
    if (!navigator.geolocation) {
      this.locationStatusMessage.set('Geolocation is not supported by your browser.');
      return;
    }

    this.isDetectingLocation.set(true);
    this.locationStatusMessage.set('Acquiring precise GPS location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        this.latitude.set(lat);
        this.longitude.set(lng);
        this.isDetectingLocation.set(false);
        this.locationSuccess.set(true);
        this.locationStatusMessage.set(`GPS Location Verified (${lat}, ${lng})`);
      },
      (error) => {
        this.isDetectingLocation.set(false);
        this.locationSuccess.set(false);
        let msg = 'Could not fetch GPS automatically. Please enter location coordinates manually below.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied by browser. Please enter location coordinates manually below.';
        }
        this.locationStatusMessage.set(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  lookupTagDetails(tagIdStr: string) {
    this.ownerUsername.set('Protected Owner');

    // Query backend public API to resolve associated vehicle & owner details for the scanned QR tag
    this.http.get<any>(`${API_BASE_URL}/api/v1/notifications/scan/${encodeURIComponent(tagIdStr)}`).subscribe({
      next: (res) => {
        if (res) {
          const data = res.data || res;
          const nick = data.nickname || '';

          if (nick) {
            this.vehicleInfo.set(nick);
          } else {
            this.vehicleInfo.set('');
          }
          
          if (data.categories && Array.isArray(data.categories)) {
            const mapped = data.categories.map((c: string) => {
              return {
                value: c,
                label: c
              };
            });
            this.categories.set(mapped);
          }
        }
      },
      error: (err) => {
        console.warn('Failed to resolve scan details via public API:', err);
        this.vehicleInfo.set('Registered Vehicle');
      }
    });
  }

  generateCaptcha() {
    this.num1.set(Math.floor(Math.random() * 9) + 1);
    this.num2.set(Math.floor(Math.random() * 9) + 1);
    this.userCaptcha.set('');
    this.captchaError.set(false);
  }

  submitNotification() {
    const activeTag = this.tagId() || this.manualTagInput();
    
    if (!activeTag) {
      this.errorMessage.set('Please provide a valid QR tag serial number.');
      return;
    }

    if (!this.selectedCategory()) {
      this.errorMessage.set('Please select a notification category.');
      return;
    }

    // Compulsory Location Validation
    if (!this.latitude() || !this.longitude()) {
      this.errorMessage.set('Location is compulsory! Click "Detect Location" or enter Latitude and Longitude.');
      return;
    }

    // Validate CAPTCHA
    const expected = this.num1() + this.num2();
    if (parseInt(this.userCaptcha()) !== expected) {
      this.captchaError.set(true);
      this.errorMessage.set('Incorrect math verification. Try again.');
      this.generateCaptcha();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const categoryObj = this.categories().find(c => c.value === this.selectedCategory());
    const categoryLabel = categoryObj ? categoryObj.label : this.selectedCategory();

    const payload = {
      serialno: activeTag,
      category: categoryLabel,
      message: this.customMessage() || `${categoryLabel} reported for tag ${activeTag}`,
      findercontact: this.contactNumber() || '',
      lattitute: this.latitude(),
      longitute: this.longitude()
    };

    // Dispatch HTTP POST request to /api/v1/notifications/send
    this.http.post<any>(`${API_BASE_URL}/api/v1/notifications/send`, payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        console.warn('Backend API notification /send attempt:', err);
        this.isSubmitting.set(false);
        if (err?.status === 400 && (
          err?.error?.code === 'NOT001' || 
          err?.error?.errorCode === 'NOT001' ||
          err?.error?.message?.includes('NOT001') || 
          err?.error?.message?.includes('expired') || 
          err?.error?.message?.includes('unavailable')
        )) {
          this.errorMessage.set('The owner of this vehicle is currently unavailable.');
        } else {
          this.errorMessage.set(err?.error?.message || 'An error occurred while sending the alert. Please try again.');
        }
      }
    });
  }

  resetForm() {
    this.isSuccess.set(false);
    this.selectedCategory.set('');
    this.customMessage.set('');
    this.contactNumber.set('');
    this.latitude.set('');
    this.longitude.set('');
    this.locationSuccess.set(false);
    this.locationStatusMessage.set('');
    this.generateCaptcha();
  }
}
