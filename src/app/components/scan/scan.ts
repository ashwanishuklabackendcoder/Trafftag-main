import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
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
  private router = inject(Router);

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

  // Location signals
  incidentLocation = signal('');

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
    setTimeout(() => {
      this.dropdownOpen.set(false);
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
  }

  lookupTagDetails(tagIdStr: string) {
    if (!tagIdStr) {
      this.categories.set([]);
      this.vehicleInfo.set('');
      return;
    }
    this.ownerUsername.set('Protected Owner');

    // First check tag status to handle activation flow
    this.http.get<any>(`${API_BASE_URL}/api/v1/qrtags/scan/${encodeURIComponent(tagIdStr)}`).subscribe({
      next: (res) => {
        if (res && res.status === 'RequiresActivation') {
          // Store QR in local storage or navigate with query param
          this.router.navigate(['/login'], { queryParams: { qrCode: res.qrCode } });
          return;
        }

        if (res) {
          // Tag is active, now fetch the full scan details including categories
          this.http.get<any>(`${API_BASE_URL}/api/v1/notifications/scan/${encodeURIComponent(tagIdStr)}`).subscribe({
            next: (notifyRes) => {
              const data = notifyRes.data || notifyRes;
              this.vehicleInfo.set('Registered Vehicle');
              const cats = data.categories || data.Categories;
              if (cats && Array.isArray(cats)) {
                const dynamicCategories = cats.map((c: string) => ({ value: c, label: c }));
                this.categories.set(dynamicCategories);
              }
            },
            error: (err) => {
              console.warn('Failed to fetch categories:', err);
              this.vehicleInfo.set('Registered Vehicle');
            }
          });
        }
      },
      error: (err) => {
        console.warn('Failed to resolve scan details:', err);
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
    if (!this.incidentLocation()) {
      this.errorMessage.set('Location is compulsory! Please enter the incident location.');
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
      lattitute: this.incidentLocation(), // Sent as latitude in payload to match backend schema for now
      longitute: ''
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
    this.incidentLocation.set('');
    this.generateCaptcha();
  }
}
