import { Component, OnInit, signal, inject, computed, ViewEncapsulation } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE_URL } from '../../config/api.config';
import { ModalService } from '../../services/modal.service';
import { QrDecalService } from '../../services/qr-decal.service';
import { VehiclesTabComponent } from './components/vehicles-tab/vehicles-tab.component';
import { QrFleetTabComponent } from './components/qr-fleet-tab/qr-fleet-tab.component';
import { AlertsTabComponent } from './components/alerts-tab/alerts-tab.component';
import { SupportTabComponent } from './components/support-tab/support-tab.component';
import { ProfileTabComponent } from './components/profile-tab/profile-tab.component';
import { VehicleRemindersTabComponent } from './components/vehicle-reminders-tab/vehicle-reminders-tab.component';
import { AddVehicleModalComponent } from './components/add-vehicle-modal/add-vehicle-modal.component';
import { LinkTagModalComponent } from './components/link-tag-modal/link-tag-modal.component';
import { State, City } from 'country-state-city';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  vin?: string;
  driverName?: string;
  stateProvince?: string;
  city?: string;
  totalScans: number;
  lastScan: string;
  prefSMS: boolean;
  prefEmail: boolean;
  tagId: string;
  active: boolean;
}

interface QRNotification {
  id: string;
  vehicleId: string;
  timestamp: string;
  category: string;
  icon: string;
  message: string;
  senderPhone?: string;
  read: boolean;
  status: 'Unresolved' | 'Resolved';
}

export type PortalTab = 
  | 'dashboard'
  | 'explore-more' 
  | 'vehicles' 
  | 'vehicle-reminders'
  | 'tags' 
  | 'notifications' 
  | 'alerts'
  | 'reports' 
  | 'pay-fine' 
  | 'rules' 
  | 'support'
  | 'finders'
  | 'rewards'
  | 'messages'
  | 'profile' 
  | 'profile-membership'
  | 'profile-vehicle-reminders'
  | 'profile-notifications' 
  | 'profile-password' 
  | 'profile-settings';

@Component({
  selector: 'app-portal',
  standalone: true,
  imports: [
      FormsModule,
      RouterLink,
      VehiclesTabComponent,
      QrFleetTabComponent,
      AlertsTabComponent,
      SupportTabComponent,
      ProfileTabComponent,
      VehicleRemindersTabComponent,
      AddVehicleModalComponent,
      LinkTagModalComponent
    ],
  templateUrl: './portal.html',
  styleUrl: './portal.css',
  encapsulation: ViewEncapsulation.None
})
export class Portal implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private modalService = inject(ModalService);
  private qrDecalService = inject(QrDecalService);

  // Navigation
  activeTab = signal<PortalTab>('dashboard');
  isMobileSidebarOpen = signal(false);

  // Resend OTP variables
  otpResendLoading = signal(false);
  otpResendSuccess = signal(false);

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update(v => !v);
  }

  // User & Membership Details
  firstName = signal('');
  lastName = signal('');
  userEmail = signal('');

  userName = computed(() => {
    const email = this.userEmail();
    return email ? email.split('@')[0] : 'User';
  });

  userInitials = computed(() => {
    const name = this.userName().toUpperCase();
    return name.substring(0, 2) || 'U';
  });
  phoneNumber = signal('');
  countryCode = signal('');
  profileImage = signal('');
  userRole = signal('Customer');
  membershipType = signal('Free Plan');
  remainingCredits = signal<number>(0);
  activeSince = signal('Jan 15, 2026');
  lastLogin = signal('Jul 16, 2026 19:30');
  referralCode = signal('TT-SARAH-992');
  rewardsBalance = signal(15.00);
  pendingRewards = signal(5.00);
  totalReferrals = signal(3);

  // Membership Plans list from API
  membershipPlans = signal<any[]>([]);

  // Renewal dates and remaining days computed dynamically
  renewalDate = computed(() => {
    return this.membershipType() === 'Free Plan' ? 'N/A' : 'Aug 15, 2026';
  });
  
  remainingDays = computed(() => {
    return this.membershipType() === 'Free Plan' ? 0 : 30;
  });

  // New Dashboard UI Properties
  planStatus = signal('ACTIVE');
  totalAlerts = signal(50);
  alertsRemaining = signal(15);
  planEndDate = signal('May 25, 2026'); // Updated to 2026 to make sense with current date
  planDaysLeft = signal(7);

  reminders = computed(() => {
    const endStr = this.planEndDate();
    let endDate = new Date(endStr);
    if (isNaN(endDate.getTime())) {
      endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
    }
    
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const d7 = new Date(endDate); d7.setDate(d7.getDate() - 7);
    const d3 = new Date(endDate); d3.setDate(d3.getDate() - 3);
    const d1 = new Date(endDate); d1.setDate(d1.getDate() - 1);
    
    return [
      { title: '7 days before', desc: `You will receive a reminder on ${formatDate(d7)}`, status: 'PENDING', iconClass: 'bg-yellow-light text-yellow-500', icon: 'fa-regular fa-calendar-days', disabled: false },
      { title: '3 days before', desc: `You will receive a reminder on ${formatDate(d3)}`, status: 'PENDING', iconClass: 'bg-orange-light text-orange-500', icon: 'fa-regular fa-calendar-days', disabled: false },
      { title: '1 day before', desc: `You will receive a reminder on ${formatDate(d1)}`, status: 'PENDING', iconClass: 'bg-red-light text-red-500', icon: 'fa-regular fa-calendar-days', disabled: false },
      { title: 'Plan ends', desc: `You will receive a final notice on ${formatDate(endDate)}`, status: 'PENDING', iconClass: 'bg-red text-white', icon: 'fa-solid fa-circle-exclamation', disabled: false },
      { title: 'Alerts expired', desc: 'You will be notified if your plan is not renewed', status: 'N/A', iconClass: 'bg-gray text-gray-500', icon: 'fa-regular fa-bell', disabled: true }
    ];
  });


  vehicles = signal<Vehicle[]>([]);
  rawUserMemberships = signal<any[]>([]);
  
  myQrs = signal<any[]>([]);

  unassignedTags = computed(() => {
    const vehiclesList = this.vehicles();
    // QRs that belong to the user but are not yet assigned to any vehicle
    return this.myQrs()
      .filter((q: any) => !vehiclesList.some(v => v.tagId === q.serialNumber))
      .map((q: any) => ({
        id: q.qrTagId,
        tagId: q.serialNumber,
        status: q.status || 'Active',
        planName: 'Purchased Tag'
      }));
  });

  // Tag counters
  activeTagsCount = computed(() => this.vehicles().filter(v => v.tagId && v.tagId !== 'Not Assigned' && v.active).length + this.unassignedTags().length);
  inactiveTagsCount = computed(() => this.vehicles().filter(v => !v.tagId || v.tagId === 'Not Assigned' || !v.active).length);


  // Notifications List
  notifications = signal<QRNotification[]>([]);

  // Unread Alert Count
  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

  // Search & Filters for Alerts
  searchQuery = signal('');
  filterVehicle = signal('all');
  filterCategory = signal('all');
  filterStatus = signal('all');

  filteredNotifications = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const vehId = this.filterVehicle();
    const cat = this.filterCategory();
    const status = this.filterStatus();

    return this.notifications().filter(n => {
      const matchesSearch = !query || 
        n.category.toLowerCase().includes(query) || 
        n.message.toLowerCase().includes(query);

      const matchesVehicle = vehId === 'all' || n.vehicleId === vehId;
      const matchesCat = cat === 'all' || n.category === cat;
      const matchesStatus = status === 'all' ||
        (status === 'read' && n.read) ||
        (status === 'unread' && !n.read) ||
        (status === 'resolved' && n.status === 'Resolved') ||
        (status === 'unresolved' && n.status === 'Unresolved');

      return matchesSearch && matchesVehicle && matchesCat && matchesStatus;
    });
  });

  // Support Ticketing Module
  supportTickets = signal([
    { id: 'TKT-8902', subject: 'Sticker peeling off due to rain', category: 'Hardware Decals', status: 'In Progress', priority: 'Medium', date: '2026-07-15', rated: false },
    { id: 'TKT-8201', subject: 'Referral credit not showing on rewards', category: 'Billing & Referral', status: 'Resolved', priority: 'High', date: '2026-07-11', rated: true, rating: 5 }
  ]);

  showSubmitTicketModal = signal(false);
  newTicketSubject = signal('');
  newTicketCategory = signal('General Support');
  newTicketPriority = signal('Medium');
  newTicketMessage = signal('');

  // Modals
  showAddVehicleModal = signal(false);
  isRegisteringVehicle = signal(false);
  showLinkTagModal = signal(false);
  showUpgradeModal = signal(false);
  showDeleteAccountModal = signal(false);
  isDeletingAccount = signal(false);

  // Form Fields
  newMake = signal('');
  newModel = signal('');
  newYear = signal(2025);
  newPlate = signal('');
  newColor = signal('');
  newTagId = signal('');
  newStateProvince = signal('');
  newCity = signal('');
  newVin = signal('');
  newDriverName = signal('');

  linkSerial = signal('');
  linkVehicleId = signal('');
  isLinkingTag = signal(false);
  
  userMembershipId = signal<number | null>(null);
  generatedTagId = signal<number | null>(null);
  qrImageBase64 = signal<string | null>(null);

  // Color Presets Database
  colorPresets = [
    { name: 'Pearl White', value: 'Pearl White', hex: '#ffffff' },
    { name: 'Solid Black', value: 'Solid Black', hex: '#0f172a' },
    { name: 'Steel Gray', value: 'Steel Gray', hex: '#64748b' },
    { name: 'Deep Blue', value: 'Deep Blue', hex: '#1e3a8a' },
    { name: 'Crimson Red', value: 'Crimson Red', hex: '#991b1b' },
    { name: 'Forest Green', value: 'Forest Green', hex: '#064e3b' }
  ];

  isCustomColorSelected = computed(() => {
    const val = this.newColor();
    if (!val) return false;
    return !this.colorPresets.some(c => c.value === val);
  });

  newColorHex = computed(() => {
    const val = this.newColor();
    if (val && val.startsWith('#')) return val;
    const preset = this.colorPresets.find(c => c.value === val);
    return preset ? preset.hex : '#3b82f6';
  });

  onCustomColorPickerChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      this.newColor.set(input.value);
    }
  }

  // Make/Model Database Dropdowns (Fetched from NHTSA API)
  makes: { id: string; name: string }[] = [];
  currentModels: { id: string; name: string }[] = [];

  selectedMakeId = signal('');
  selectedModelId = signal('');

  loadMakes() {
    this.http.get<any>(`${API_BASE_URL}/api/v1/vehicles/makes`)
      .subscribe({
        next: (res) => {
          if (res && res.data) {
            this.makes = res.data.map((item: any) => ({
              id: item.makeId.toString(),
              name: item.name
            })).sort((a: any, b: any) => a.name.localeCompare(b.name));
          }
        },
        error: (err) => console.error('Error loading makes:', err)
      });
  }

  onMakeChange(makeId: string) {
    this.selectedMakeId.set(makeId);
    this.selectedModelId.set('');
    this.newMake.set('');
    this.newModel.set('');
    this.currentModels = [];

    const makeObj = this.makes.find(m => m.id === makeId);
    if (makeObj) {
      this.newMake.set(makeObj.name);
      
      this.currentModels = [{ id: '', name: 'Loading models...' }];
      this.http.get<any>(`${API_BASE_URL}/api/v1/vehicles/models/${makeId}`)
        .subscribe({
          next: (res) => {
            if (res && res.data) {
              this.currentModels = res.data.map((item: any) => ({
                id: item.modelId.toString(),
                name: item.name
              })).sort((a: any, b: any) => a.name.localeCompare(b.name));
            } else {
              this.currentModels = [];
            }
          },
          error: (err) => {
            console.error('Error loading models:', err);
            this.currentModels = [];
          }
        });
    }
  }

  getModelsForSelectedMake() {
    return this.currentModels;
  }

  // Location Database Dropdowns (US only)
  usStates = State.getStatesOfCountry('US');
  usCities = signal<any[]>([]);

  onStateChange(stateCode: string) {
    this.newStateProvince.set(stateCode);
    this.newCity.set('');
    if (stateCode) {
      this.usCities.set(City.getCitiesOfState('US', stateCode));
    } else {
      this.usCities.set([]);
    }
  }

  loadVehicles() {
    this.http.get<any>(`${API_BASE_URL}/api/v1/vehicles`)
      .subscribe({
        next: (res) => {
          if (res?.success && res?.data?.data) {
            const list = res.data.data.map((item: any) => this.mapApiVehicle(item));
            this.vehicles.set(list);
          }
        },
        error: (err) => {
          console.error('Error loading vehicles:', err);
          if (err?.status === 401) {
            this.logout();
          }
        }
      });
  }

  mapApiVehicle(apiV: any): Vehicle {
    const vehId = apiV.vehicleId.toString();
    
    // Vehicles start as Unassigned unless explicitly linked by user
    const effectiveTagId = apiV.activeQrTag || 'Not Assigned';
    const isAssigned = effectiveTagId !== 'Not Assigned';

    return {
      id: vehId,
      make: apiV.make || 'Unknown',
      model: apiV.model || 'Unknown',
      year: apiV.year || 2025,
      plate: apiV.licensePlate || 'Unknown',
      color: apiV.color || 'Unknown',
      stateProvince: apiV.state || apiV.stateProvince || 'California',
      city: apiV.city || '',
      vin: apiV.vin || '',
      driverName: apiV.driverName || apiV.driverName || this.userName(),
      totalScans: apiV.totalScans || 0,
      lastScan: apiV.lastScan || 'Never',
      prefSMS: apiV.receiveSMS ?? true,
      prefEmail: apiV.receiveEmail ?? true,
      tagId: effectiveTagId,
      active: isAssigned && (apiV.status === 'Active')
    };
  }

  loadNotifications() {
    this.http.get<any>(`${API_BASE_URL}/api/v1/notifications`)
      .subscribe({
        next: (res) => {
          if (res?.success && res?.data?.data) {
            const list = res.data.data.map((item: any) => this.mapApiNotification(item));
            this.notifications.set(list);
          } else if (res?.success && Array.isArray(res?.data)) {
            const list = res.data.map((item: any) => this.mapApiNotification(item));
            this.notifications.set(list);
          }
        },
        error: (err) => {
          console.error('Error loading notifications:', err);
          if (err?.status === 401) {
            this.logout();
          }
        }
      });
  }

  loadMyQrs() {
    this.http.get<any>(`${API_BASE_URL}/api/v1/qrtags/my-qrs`)
      .subscribe({
        next: (res) => {
          if (res?.success && Array.isArray(res?.data)) {
            this.myQrs.set(res.data);
          }
        },
        error: (err) => console.error('Error loading My QRs:', err)
      });
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Headlights Left On': return 'fa-solid fa-lightbulb';
      case 'Parking Obstruction': return 'fa-solid fa-square-parking';
      case 'Window Rolled Down': return 'fa-solid fa-window-maximize';
      case 'Flat Tire': return 'fa-solid fa-car-burst';
      case 'Emergency / Towing': return 'fa-solid fa-circle-exclamation';
      default: return 'fa-solid fa-bell';
    }
  }

  mapApiNotification(apiN: any): QRNotification {
    return {
      id: (apiN.notificationId || apiN.id || Math.random().toString()).toString(),
      vehicleId: (apiN.vehicleId || '').toString(),
      timestamp: (apiN.createdOn || apiN.createdAt) ? new Date(String(apiN.createdOn || apiN.createdAt).replace(' ', 'T')).toLocaleString() : apiN.timestamp || 'Just now',
      category: apiN.category || 'General Alert',
      icon: this.getCategoryIcon(apiN.category),
      message: apiN.message || '',
      senderPhone: apiN.finderContact || apiN.senderPhone || '',
      read: apiN.readStatus ?? apiN.isRead ?? apiN.read ?? false,
      status: (apiN.deliveryStatus || apiN.status) === 'Resolved' ? 'Resolved' : 'Unresolved'
    };
  }

  getScanUrl(tagId: string): string {
    return `${window.location.origin}/scan/${tagId}`;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const sub = params.get('subpage');
      const validTabs = ['dashboard', 'explore-more', 'vehicles', 'vehicle-reminders', 'tags', 'notifications', 'alerts', 'reports', 'pay-fine', 'rules', 'support', 'finders', 'rewards', 'messages', 'profile', 'profile-membership', 'profile-vehicle-reminders', 'profile-notifications', 'profile-password', 'profile-settings'];
      
      if (sub && validTabs.includes(sub)) {
        this.activeTab.set(sub as any);
      } else {
        this.router.navigate(['/portal', 'dashboard'], { replaceUrl: true });
      }
    });

    this.route.queryParamMap.subscribe(params => {
      const paymentStatus = params.get('payment');
      const sessionId = params.get('session_id');

      if (paymentStatus === 'success') {
        if (sessionId) {
          this.http.post<any>(`${API_BASE_URL}/api/v1/payments/verify-session`, { sessionId })
            .subscribe({
              next: () => {
                this.modalService.showSuccess(
                  'Payment Successful',
                  'Thank you for upgrading! Your membership is now active.'
                ).then(() => {
                  const pending = localStorage.getItem('pendingAction');
                  if (pending) {
                    localStorage.removeItem('pendingAction');
                    try {
                      const action = JSON.parse(pending);
                      if (action.action === 'generateNewQrTag') {
                        setTimeout(() => this.generateNewQrTag(action.vehicleId), 500);
                      }
                    } catch (e) {}
                  }
                  
                  const pendingQr = localStorage.getItem('pendingQrCode');
                  if (pendingQr) {
                    setTimeout(() => {
                      this.http.post<any>(`${API_BASE_URL}/api/v1/qrtags/claim/${pendingQr}`, {}).subscribe({
                        next: () => {
                          this.modalService.showSuccess('QR Claimed', 'Your QR code is now active and assigned to you.');
                          localStorage.removeItem('pendingQrCode');
                          this.selectTab('tags');
                        }
                      });
                    }, 500);
                  }
                });
                this.loadUserMemberships();
                this.router.navigate([], {
                  queryParams: { payment: null, session_id: null },
                  queryParamsHandling: 'merge',
                  replaceUrl: true
                });
              },
              error: () => {
                this.modalService.showError('Payment Verification Failed', 'We could not verify your payment immediately. It may take a few minutes.');
                this.router.navigate([], {
                  queryParams: { payment: null, session_id: null },
                  queryParamsHandling: 'merge',
                  replaceUrl: true
                });
              }
            });
        } else {
          this.modalService.showSuccess(
            'Payment Successful',
            'Thank you for upgrading! Your membership is now active.'
          );
          this.router.navigate([], {
            queryParams: { payment: null },
            queryParamsHandling: 'merge',
            replaceUrl: true
          });
        }
      } else if (paymentStatus === 'cancelled') {
        this.modalService.showWarning(
          'Payment Cancelled',
          'Checkout was cancelled. You can try again when you are ready.'
        );
        this.router.navigate([], {
          queryParams: { payment: null, session_id: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }
    });

    // Set user details dynamically from active token payload
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.firstName.set(payload.given_name || '');
        this.lastName.set(payload.family_name || '');
        this.userEmail.set(payload.email || 'arvindverma630635@gmail.com');
      } catch (e) {
        this.firstName.set('ARVIND');
        this.lastName.set('VERMA');
        this.userEmail.set('arvindverma630635@gmail.com');
      }
      this.loadMakes();
      this.loadVehicles();
      this.loadProfile();
      this.loadUserMemberships();
      this.loadNotifications();
      this.loadMembershipPlans();
      this.loadMyQrs();

      const pendingQr = localStorage.getItem('pendingQrCode');
      if (pendingQr) {
        // If we just came in with a pending QR, redirect to membership tab
        // Or if they already have an active membership, try to claim it directly.
        // For simplicity, we just route to profile-membership and let them upgrade/claim.
        // A robust solution would call the API to check membership and claim automatically.
        setTimeout(() => {
          this.http.post<any>(`${API_BASE_URL}/api/v1/qrtags/claim/${pendingQr}`, {}).subscribe({
            next: (res) => {
              this.modalService.showSuccess('QR Claimed', 'The scanned QR code has been successfully assigned to your account.');
              localStorage.removeItem('pendingQrCode');
              this.selectTab('tags');
            },
            error: (err) => {
              if (err?.error?.message?.includes('membership')) {
                this.modalService.showWarning('Membership Required', 'Please purchase a membership to activate this QR tag.');
                this.selectTab('profile-membership');
              } else if (err?.error?.message?.includes('already')) {
                this.modalService.showWarning('Already Claimed', 'This QR tag is already claimed.');
                localStorage.removeItem('pendingQrCode');
              } else {
                this.modalService.showError('Claim Failed', 'Could not claim the QR tag. Please try again from the tags menu.');
              }
            }
          });
        }, 1000);
      }
    }
  }

  selectTab(tab: PortalTab) {
    this.activeTab.set(tab);
    this.isMobileSidebarOpen.set(false);
    this.router.navigate(['/portal', tab]);
  }

  resendOtp() {
    this.otpResendLoading.set(true);
    this.otpResendSuccess.set(false);
    setTimeout(() => {
      this.otpResendLoading.set(false);
      this.otpResendSuccess.set(true);
      setTimeout(() => this.otpResendSuccess.set(false), 5000);
    }, 1200);
  }

  addVehicle() {
    if (this.isRegisteringVehicle()) return;
    if (!this.selectedMakeId() || !this.selectedModelId() || !this.newPlate()) return;
    
    // Free membership plan vehicle limit check (SRS & Business Rule: Max 2 vehicles on Free Plan)
    const currentMembership = this.membershipType().toLowerCase();
    if (currentMembership.includes('free') && this.vehicles().length >= 2) {
      this.modalService.showWarning(
        'Vehicle Limit Reached',
        'Your current Free Plan allows a maximum of 2 registered vehicles. Please upgrade your membership plan to add more vehicles.'
      );
      return;
    }

    const makeObj = this.makes.find(m => String(m.id) === String(this.selectedMakeId()));
    const modelObj = this.getModelsForSelectedMake().find(m => String(m.id) === String(this.selectedModelId()));

    const makeStr = makeObj ? makeObj.name : this.selectedMakeId();
    const modelStr = modelObj ? modelObj.name : this.selectedModelId();

    const makeIdNum = parseInt(this.selectedMakeId(), 10);
    const modelIdNum = parseInt(this.selectedModelId(), 10);

    const body = {
      makeId: !isNaN(makeIdNum) ? makeIdNum : 1,
      modelId: !isNaN(modelIdNum) ? modelIdNum : 1,
      make: makeStr,
      model: modelStr,
      year: this.newYear() || 2025,
      vin: this.newVin() || null,
      licensePlate: this.newPlate().toUpperCase(),
      color: this.newColor() || 'Unknown',
      state: this.newStateProvince() || 'CA',
      city: this.newCity() || '',
      driverName: this.newDriverName() || this.userName(),
      nickName: `${makeStr} ${modelStr}`.trim()
    };

    this.isRegisteringVehicle.set(true);
    this.http.post<any>(`${API_BASE_URL}/api/v1/vehicles`, body)
      .subscribe({
        next: (res) => {
          this.isRegisteringVehicle.set(false);
          this.loadVehicles();
          this.closeAddVehicle();
          this.modalService.showSuccess('Vehicle Registered', 'New vehicle has been successfully added to your protection registry.');
        },
        error: (err) => {
          this.isRegisteringVehicle.set(false);
          this.loadVehicles();
          const rawErr = err?.error?.message || err?.error?.Message || (typeof err?.error === 'string' ? err.error : '');
          this.modalService.showError('Registration Failed', rawErr || 'Error occurred while registering vehicle.');
        }
      });
  }

  async deleteVehicle(id: string) {
    const confirmed = await this.modalService.confirm({
      title: 'Remove Vehicle',
      message: 'Are you sure you want to remove this vehicle from your registry? Any linked QR tags will be unassigned.',
      confirmText: 'Delete Vehicle',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (confirmed) {
      this.http.delete<any>(`${API_BASE_URL}/api/v1/vehicles/${id}`)
        .subscribe({
          next: () => {
            this.loadVehicles();
            this.modalService.showSuccess('Vehicle Removed', 'The vehicle has been successfully deleted from your registry.');
          },
          error: (err) => {
            this.modalService.showError('Deletion Failed', err?.error?.message || 'Error occurred while deleting vehicle.');
          }
        });
    }
  }

  toggleVehicleActive(id: string) {
    const v = this.vehicles().find(item => item.id === id);
    if (!v) return;

    // Toggle preferences for SMS/Email notifications
    const body = {
      receiveSMS: !v.prefSMS,
      receiveEmail: !v.prefEmail,
      receivePush: true,
      silentHoursStart: null,
      silentHoursEnd: null
    };

    this.http.put<any>(`${API_BASE_URL}/api/v1/vehicles/${id}/preferences`, body)
      .subscribe({
        next: () => {
          this.loadVehicles();
        },
        error: (err) => {
          console.error('Error updating vehicle preferences:', err);
        }
      });
  }

  linkTag() {
    if (this.isLinkingTag()) return;
    if (!this.linkSerial() || !this.linkVehicleId()) return;

    this.isLinkingTag.set(true);

    const serialStr = this.linkSerial().trim();
    const vehicleIdStr = this.linkVehicleId();
    const vehicleIdNum = parseInt(vehicleIdStr, 10);
    
    const assignTagToVehicle = (resolvedTagId: number) => {
      const assignBody = { vehicleId: vehicleIdNum };
      this.http.post<any>(`${API_BASE_URL}/api/v1/qrtags/${resolvedTagId}/assign`, assignBody)
        .subscribe({
          next: (res) => {
            this.isLinkingTag.set(false);
            this.loadVehicles();
            this.loadUserMemberships();
            this.closeLinkTag();
            this.modalService.showSuccess('QR Tag Linked', `QR Sticker Tag (${serialStr}) assigned and activated successfully.`);
          },
          error: (err) => {
            this.isLinkingTag.set(false);
            console.error('API /qrtags/{id}/assign failed:', err);
            this.modalService.showError('Assignment Failed', err?.error?.message || 'Failed to link QR tag to vehicle. Please try again.');
          }
        });
    };

    // Fast-path: if the tag is already in our unassigned tags list, we already know its database ID!
    // And because it was generated via the system, it's already Active. We can skip activation!
    const existingTag = this.unassignedTags().find(t => t.tagId === serialStr);
    if (existingTag && existingTag.id) {
      assignTagToVehicle(existingTag.id);
      return;
    }

    // Fallback: If it's a completely new physical tag not in the system yet, activate it first
    const activateBody = {
      serialNumber: serialStr,
      activationCode: ''
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/qrtags/activate`, activateBody)
      .subscribe({
        next: (actRes) => {
          const resolvedTagId = (typeof actRes?.data === 'number' ? actRes.data : null) || actRes?.qrTagId || actRes?.id || actRes?.data?.qrTagId || actRes?.data?.id || this.generatedTagId();
          if (resolvedTagId) {
            assignTagToVehicle(resolvedTagId);
          } else {
            const match = serialStr.match(/\d+$/);
            const fallbackId = match ? parseInt(match[0], 10) : 1;
            assignTagToVehicle(fallbackId);
          }
        },
        error: (err) => {
          console.warn('API /qrtags/activate info:', err);
          let tagId = this.generatedTagId();
          if (!tagId) {
            const match = serialStr.match(/\d+$/);
            tagId = match ? parseInt(match[0], 10) : 1;
          }
          assignTagToVehicle(tagId);
        }
      });
  }

  // Alerts logic
  markAsRead(notifId: string) {
    this.notifications.update(list => {
      return list.map(n => n.id === notifId ? { ...n, read: true } : n);
    });
  }

  markAllAsRead() {
    this.notifications.update(list => list.map(n => ({ ...n, read: true })));
    this.modalService.showSuccess('Alerts Updated', 'All notifications have been marked as read.');
  }

  clearNotificationFilters() {
    this.searchQuery.set('');
    this.filterVehicle.set('all');
    this.filterCategory.set('all');
    this.filterStatus.set('all');
  }

  simulateTestNotification() {
    const firstVeh = this.vehicles()[0];
    const vehName = firstVeh ? `${firstVeh.make} ${firstVeh.model}` : 'Toyota Fortuner';
    const vehId = firstVeh ? firstVeh.id : '1';
    const serialno = (firstVeh && firstVeh.tagId && firstVeh.tagId !== 'Not Assigned') ? firstVeh.tagId : 'TT-718204';

    const sendPayload = {
      serialno: serialno,
      category: 'Headlights Left On',
      message: `Friendly alert: The headlights on your ${vehName} appear to be turned on in the parking area.`,
      findercontact: '+1 (555) 234-5678',
      lattitute: '37.7749',
      longitute: '-122.4194'
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/notifications/send`, sendPayload)
      .subscribe({
        next: (res) => {
          this.loadNotifications();
          this.modalService.showSuccess('Test Alert Dispatched', `Security alert sent via API for ${vehName}.`);
        },
        error: (err) => {
          console.warn('API /notifications/send dispatch fallback:', err);
          const testNotif: QRNotification = {
            id: 'TEST-' + Math.floor(Math.random() * 9000 + 1000),
            vehicleId: vehId,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
            category: 'Headlights Left On',
            icon: 'fa-solid fa-lightbulb',
            message: sendPayload.message,
            senderPhone: sendPayload.findercontact,
            read: false,
            status: 'Unresolved'
          };
          this.notifications.update(list => [testNotif, ...list]);
          this.modalService.showSuccess('Test Alert Dispatched', `Simulated alert generated for ${vehName}.`);
        }
      });
  }

  getVehicleName(vehId: string): string {
    const v = this.vehicles().find(item => item.id.toString() === vehId.toString());
    return v ? `${v.make} ${v.model} (${v.plate})` : 'Registered Vehicle';
  }

  toggleResolve(notifId: string) {
    this.notifications.update(list => {
      return list.map(n => {
        if (n.id === notifId) {
          const nextStatus = n.status === 'Resolved' ? 'Unresolved' : ('Resolved' as const);
          return { ...n, status: nextStatus, read: true };
        }
        return n;
      });
    });
  }

  // Support Ticket logic
  submitTicket() {
    if (!this.newTicketSubject() || !this.newTicketMessage()) return;

    const newT = {
      id: 'TKT-' + Math.floor(Math.random() * 9000 + 1000),
      subject: this.newTicketSubject(),
      category: this.newTicketCategory(),
      status: 'Open',
      priority: this.newTicketPriority(),
      date: new Date().toISOString().split('T')[0],
      rated: false
    };

    this.supportTickets.update(list => [newT, ...list]);
    this.closeSubmitTicket();
  }

  rateTicket(ticketId: string, stars: number) {
    this.supportTickets.update(list =>
      list.map(t => t.id === ticketId ? { ...t, rated: true, rating: stars } : t)
    );
  }

  upgradePlan(planId: number) {
    const payload = {
      checkoutType: 'Membership',
      planId: planId,
      successUrl: `${window.location.origin}/portal/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/portal/dashboard?payment=cancelled`
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/payments/checkout`, payload)
      .subscribe({
        next: (res) => {
          this.showUpgradeModal.set(false);
          const checkoutUrl = typeof res === 'string' ? res : (res?.url || res?.data?.url || res?.data);
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          } else {
            this.modalService.showError('Payment Error', 'Failed to retrieve Stripe Checkout session URL.');
          }
        },
        error: (err) => {
          console.error('Error creating checkout session:', err);
          this.modalService.showError('Payment Error', err?.error?.message || 'Could not initiate payment process.');
        }
      });
  }

  // Modals operations
  openAddVehicle() { this.showAddVehicleModal.set(true); }
  closeAddVehicle() {
    this.showAddVehicleModal.set(false);
    this.selectedMakeId.set('');
    this.selectedModelId.set('');
    this.newMake.set('');
    this.newModel.set('');
    this.newPlate.set('');
    this.newColor.set('');
    this.newTagId.set('');
    this.newStateProvince.set('');
    this.newCity.set('');
    this.newVin.set('');
    this.newDriverName.set('');
  }

  openLinkTag(vehicleId?: string) {
    if (vehicleId) {
      this.linkVehicleId.set(vehicleId);
    }
    this.showLinkTagModal.set(true);
  }
  closeLinkTag() {
    this.showLinkTagModal.set(false);
    this.linkSerial.set('');
    this.linkVehicleId.set('');
    this.qrImageBase64.set(null);
    this.generatedTagId.set(null);
  }

  openUpgrade() { this.showUpgradeModal.set(true); }
  closeUpgrade() { this.showUpgradeModal.set(false); }

  openSubmitTicket() { this.showSubmitTicketModal.set(true); }
  closeSubmitTicket() {
    this.showSubmitTicketModal.set(false);
    this.newTicketSubject.set('');
    this.newTicketCategory.set('General Support');
    this.newTicketPriority.set('Medium');
    this.newTicketMessage.set('');
  }

  // Profile Edit & Password State
  isEditingProfile = signal(false);
  editFirstName = signal('');
  editLastName = signal('');
  editPhoneNumber = signal('');
  editCountryCode = signal('');

  currentPassword = signal('');
  newPassword = signal('');
  isUpdatingPassword = signal(false);
  passwordUpdateMessage = signal('');
  passwordUpdateError = signal('');

  loadProfile() {
    this.http.get<any>(`${API_BASE_URL}/api/v1/profile`)
      .subscribe({
        next: (res) => {
          if (res?.success && res?.data) {
            const d = res.data;
            this.firstName.set(d.firstName || '');
            this.lastName.set(d.lastName || '');
            this.userEmail.set(d.email || '');
            this.phoneNumber.set(d.phoneNumber || '');
            this.countryCode.set(d.countryCode || '');
            this.profileImage.set(d.profileImage || '');
            this.userRole.set(d.role || 'Customer');
            this.membershipType.set(d.activeMembership || 'Free Plan');
            
            // Extract membership ID if available
            if (d.userMembershipId || d.activeMembershipId || d.membershipId) {
              this.userMembershipId.set(d.userMembershipId || d.activeMembershipId || d.membershipId);
            }
          }
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          if (err?.status === 401) {
            this.logout();
          }
        }
      });
  }

  loadUserMemberships() {
    this.http.get<any>(`${API_BASE_URL}/api/v1/user-memberships`)
      .subscribe({
        next: (res) => {
          const list = Array.isArray(res) ? res : (res?.data || res?.data?.data || (res?.success && res?.data ? res.data : []));
          const items = Array.isArray(list) ? list : (res?.data ? [res.data] : []);
          if (items.length > 0) {
            // Prioritize an active membership that hasn't generated a QR tag yet
            const active = items.find((m: any) => (m.status === 'Active' || m.isActive) && !m.qrTagId) 
                        || items.find((m: any) => (m.status === 'Active' || m.isActive)) 
                        || items[0];
            if (active) {
              this.userMembershipId.set(active.userMembershipId);
              const planName = active.planName || active.membershipPlan?.name || active.plan?.name || active.name;
              if (planName) {
                this.membershipType.set(planName);
              }
              if (active.remainingCredits !== undefined) {
                this.remainingCredits.set(active.remainingCredits);
              }
              
              // Dynamic dashboard fields
              this.planStatus.set(active.status || (active.isActive ? 'ACTIVE' : 'INACTIVE') || 'ACTIVE');
              
              const planNameStr = planName || '';
              const limit = active.membershipPlan?.alertLimit || active.plan?.alertLimit || active.alertLimit || 
                            active.membershipPlan?.creditsAllowance || active.plan?.creditsAllowance || active.creditsAllowance ||
                            (planNameStr.toLowerCase().includes('basic') ? 10 : 50);
              this.totalAlerts.set(limit);
              this.alertsRemaining.set(active.remainingCredits !== undefined ? active.remainingCredits : (active.remainingAlerts !== undefined ? active.remainingAlerts : limit));
              
              if (active.endDate) {
                  const end = new Date(String(active.endDate).replace(' ', 'T'));
                  this.planEndDate.set(end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
                  const diffTime = Math.max(0, end.getTime() - new Date().getTime());
                  this.planDaysLeft.set(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
              } else {
                  // Fallback if no end date
                  const mockEnd = new Date();
                  mockEnd.setDate(mockEnd.getDate() + 30);
                  this.planEndDate.set(mockEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
                  this.planDaysLeft.set(30);
              }
            }
          }

          this.rawUserMemberships.set(items);
        },
        error: (err) => {
          console.warn('Could not fetch user memberships from /api/v1/user-memberships:', err);
        }
      });
  }

  loadMembershipPlans() {
    this.http.get<any>(`${API_BASE_URL}/api/v1/memberships/plans`)
      .subscribe({
        next: (res) => {
          if (res?.success && Array.isArray(res.data)) {
            this.membershipPlans.set(res.data);
          } else if (Array.isArray(res)) {
            this.membershipPlans.set(res);
          }
        },
        error: (err) => {
          console.error('Error loading membership plans:', err);
        }
      });
  }

  getPlanFeatures(plan: any): string[] {
    const features: string[] = [];
    
    if (plan.membershipTypeName) {
      features.push(`${plan.membershipTypeName} Notifications`);
    } else {
      features.push(`Standard Notifications`);
    }
    
    if (plan.credits !== undefined && plan.credits !== null) {
      features.push(`${plan.credits} Alerts per Month`);
      features.push('1 Tag');
    }

    if (plan.validityDays !== undefined && plan.validityDays !== null) {
      features.push(`${plan.validityDays} Days Validity Period`);
    }

    if (features.length === 0) {
      return ['Active Vehicle Protection', 'Alert scan notification'];
    }
    
    return features;
  }

  redirectToBillingPortal() {
    const payload = {
      returnUrl: `${window.location.origin}/portal/profile`
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/payments/portal`, payload)
      .subscribe({
        next: (res) => {
          const portalUrl = typeof res === 'string' ? res : (res?.url || res?.data?.url || res?.data);
          if (portalUrl) {
            window.location.href = portalUrl;
          } else {
            this.modalService.showError('Billing Portal Error', 'Failed to retrieve Stripe Customer Portal session URL.');
          }
        },
        error: (err) => {
          console.error('Error redirecting to billing portal:', err);
          this.modalService.showError('Billing Portal Error', err?.error?.message || 'Could not initiate Stripe Customer Portal.');
        }
      });
  }

  startEditingProfile() {
    this.editFirstName.set(this.firstName());
    this.editLastName.set(this.lastName());
    this.editPhoneNumber.set(this.phoneNumber());
    this.editCountryCode.set(this.countryCode());
    this.isEditingProfile.set(true);
  }

  cancelEditingProfile() {
    this.isEditingProfile.set(false);
  }

  saveProfile() {
    const body = {
      firstName: this.editFirstName(),
      lastName: this.editLastName(),
      phoneNumber: this.editPhoneNumber(),
      countryCode: this.editCountryCode() || 'US',
      profileImage: this.profileImage() || null
    };

    this.http.put<any>(`${API_BASE_URL}/api/v1/profile`, body)
      .subscribe({
        next: (res) => {
          if (res?.success) {
            this.firstName.set(this.editFirstName());
            this.lastName.set(this.editLastName());
            this.phoneNumber.set(this.editPhoneNumber());
            this.countryCode.set(this.editCountryCode());
            this.modalService.showSuccess('Profile Updated', 'Your account details have been successfully updated.');
          } else {
            this.modalService.showError('Update Failed', res?.message || 'Failed to update profile.');
          }
        },
        error: (err) => {
          this.modalService.showError('Update Failed', err?.error?.message || 'Error occurred while updating profile.');
        }
      });
  }

  updatePassword() {
    if (this.isUpdatingPassword()) return;
    if (!this.currentPassword() || !this.newPassword()) {
      this.passwordUpdateError.set('Please fill out all password fields.');
      return;
    }


    this.isUpdatingPassword.set(true);
    this.passwordUpdateMessage.set('');
    this.passwordUpdateError.set('');

    const body = {
      currentPassword: this.currentPassword(),
      newPassword: this.newPassword()
    };

    this.http.put<any>(`${API_BASE_URL}/api/v1/profile/password`, body)
      .subscribe({
        next: (res) => {
          this.isUpdatingPassword.set(false);
          if (res?.success) {
            this.passwordUpdateMessage.set('Password updated successfully!');
            this.currentPassword.set('');
            this.newPassword.set('');
          } else {
            this.passwordUpdateError.set(res?.message || 'Failed to update password.');
          }
        },
        error: (err) => {
          this.isUpdatingPassword.set(false);
          this.passwordUpdateError.set(err?.error?.message || 'Failed to update password.');
        }
      });
  }

  // Account Deletion Modal handling
  openDeleteAccountModal() {
    this.showDeleteAccountModal.set(true);
  }

  closeDeleteAccountModal() {
    this.showDeleteAccountModal.set(false);
  }

  executeDeleteAccount() {
    this.isDeletingAccount.set(true);
    this.http.delete(`${API_BASE_URL}/api/v1/profile/account`)
      .subscribe({
        next: () => {
          this.isDeletingAccount.set(false);
          this.closeDeleteAccountModal();
          this.logout();
        },
        error: (err) => {
          console.error('Failed to delete account', err);
          this.isDeletingAccount.set(false);
          this.modalService.showError('Account Deletion Failed', 'Could not delete your account at this time.');
        }
      });
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('otpEmail');
    this.router.navigate(['/login']);
  }

  downloadingVehicleId = signal<string | null>(null);

  generateNewQrTag(vehicleId?: string) {
    const memId = this.userMembershipId();
    if (!memId) {
      this.modalService.confirm({
        title: 'Active Membership Required',
        message: 'You need an active membership plan to generate a new QR Tag. Would you like to view our plans now?',
        confirmText: 'View Plans',
        cancelText: 'Cancel',
        type: 'info'
      }).then(confirmed => {
        if (confirmed) {
          localStorage.setItem('pendingAction', JSON.stringify({ action: 'generateNewQrTag', vehicleId: vehicleId || null }));
          this.showUpgradeModal.set(true);
        }
      });
      return;
    }

    const payload = {
      userMembershipId: memId
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/qrtags/generate`, payload)
      .subscribe({
        next: (res) => {
          let serialNumber = `TT-${Math.floor(10000000 + Math.random() * 90000000)}`;
          let qrImage = '';
          let resolvedTagId: number | null = null;
          
          if (res?.data) {
            const d = res.data;
            serialNumber = d.serialNumber || serialNumber;
            qrImage = d.qrImageBase64 || '';
            resolvedTagId = d.qrTagId || null;
          } else if (res?.serialNumber) {
            serialNumber = res.serialNumber;
            qrImage = res.qrImageBase64 || '';
            resolvedTagId = res.qrTagId || null;
          }

          this.linkSerial.set(serialNumber);
          if (resolvedTagId) {
            this.generatedTagId.set(resolvedTagId);
          }
          if (qrImage) {
            this.qrImageBase64.set(qrImage);
          }
          if (vehicleId) {
            this.linkVehicleId.set(vehicleId);
          }
          
          this.loadUserMemberships();
          this.showLinkTagModal.set(true);

          this.modalService.showSuccess(
            'QR Tag Generated',
            `New QR Tag (${serialNumber}) generated successfully via API! Select a vehicle below to assign and activate.`
          );
        },
        error: (err) => {
          console.warn('API /qrtags/generate attempt:', err);
          const errorMsg = err?.error?.message || 'Could not generate QR tag. Ensure your membership is active.';
          
          if (errorMsg.includes('already been used')) {
            this.modalService.confirm({
              title: 'Plan Limit Reached',
              message: 'Your current membership has already been used to generate a QR Tag. Would you like to view our plans to get another one?',
              confirmText: 'View Plans',
              cancelText: 'Cancel',
              type: 'warning'
            }).then(confirmed => {
              if (confirmed) {
                localStorage.setItem('pendingAction', JSON.stringify({ action: 'generateNewQrTag', vehicleId: vehicleId || null }));
                this.showUpgradeModal.set(true);
              }
            });
          } else {
            this.modalService.showError('QR Tag Generation Failed', errorMsg);
          }
        }
      });
  }

  downloadQrCode(veh: Vehicle) {
    if (!veh.tagId || veh.tagId === 'Not Assigned') {
      this.modalService.showWarning(
        'Tag Assignment Required',
        `Vehicle "${veh.make} ${veh.model}" (${veh.plate}) does not have an assigned QR Tag yet. Please assign a QR Tag to this vehicle first before downloading.`
      );
      return;
    }

    const tagId = veh.tagId;
    const scanUrl = this.getScanUrl(tagId);
    this.downloadingVehicleId.set(veh.id);

    // Fetch image from API endpoint
    this.http.get(`${API_BASE_URL}/api/v1/qrtags/${encodeURIComponent(tagId)}/image`, {
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        if (blob && blob.size > 0 && blob.type.startsWith('image/')) {
          // Generate PDF with the backend image instead of direct PNG download
          this.qrDecalService.generateAndDownloadPdfWithFrame(veh, blob)
            .then(() => this.downloadingVehicleId.set(null))
            .catch(() => this.downloadingVehicleId.set(null));
        } else {
          this.qrDecalService.generateAndDownloadCanvasQr(veh, tagId, scanUrl)
            .then(() => this.downloadingVehicleId.set(null));
        }
      },
      error: () => {
        // Fallback: Generate high-res branded decal PNG via QrDecalService
        this.qrDecalService.generateAndDownloadCanvasQr(veh, tagId, scanUrl)
          .then(() => this.downloadingVehicleId.set(null));
      }
    });
  }

  openScanner() {
    this.modalService.showWarning('Scanner', 'QR Code Scanner is not available on desktop. Please use the mobile app.');
  }

  redirectToShop() {
    window.open('https://shop.trafftag.com', '_blank');
  }
}





