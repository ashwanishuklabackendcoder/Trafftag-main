import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../config/api.config';
import { QrDecalService } from '../../services/qr-decal.service';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  plan: string;
  status: 'Active' | 'Suspended';
  joinedDate: string;
}

interface AdminTag {
  serial: string;
  uniqueCode: string;
  qrValue?: string;
  ownerEmail: string;
  plate: string;
  status: string;
  scansCount: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private qrDecalService = inject(QrDecalService);

  activeTab = signal<'dashboard' | 'users' | 'memberships' | 'tags' | 'enquiries' | 'gateways' | 'profile'>('dashboard');
  isMobileSidebarOpen = signal(false);

  // Resend OTP variables
  otpResendLoading = signal(false);
  otpResendSuccess = signal(false);

  // System Stats
  totalUsersCount = signal(1240);
  activeUsersCount = signal(982);
  totalVehiclesCount = signal(1843);
  totalTagsCount = signal(3102);
  membershipRevenue = signal(4580);
  ordersTodayCount = signal(24);
  ticketsTodayCount = signal(8);
  notificationsTodayCount = signal(134);

  // Users List
  users = signal<AdminUser[]>([
    { id: 'u1', name: 'Sarah Jenkins', email: 'sarah.j@example.com', phone: '+1 555-304-2911', role: 'Customer', plan: 'Free Plan', status: 'Active', joinedDate: '2026-05-10' },
    { id: 'u2', name: 'Marcus Brody', email: 'marcus.b@fleet.com', phone: '+1 555-890-4109', role: 'Fleet Manager', plan: 'Premium Fleet', status: 'Active', joinedDate: '2026-02-14' },
    { id: 'u3', name: 'Liam O\'Connor', email: 'liam.oc@example.com', phone: '+1 555-718-2044', role: 'Customer', plan: 'Premium Monthly', status: 'Suspended', joinedDate: '2026-06-22' },
    { id: 'u4', name: 'Clara Oswald', email: 'clara@support.trafftag.com', phone: '+1 555-901-3820', role: 'Support Agent', plan: 'Free Plan', status: 'Active', joinedDate: '2026-01-08' }
  ]);

  // QR Tags list
  tags = signal<AdminTag[]>([]);

  // Enquiries & Support tickets
  enquiries = signal([
    { id: 'ENQ-201', name: 'John Doe', email: 'john@example.com', phone: '+1 555-019-2831', subject: 'Custom fleet pricing request', message: 'Hi, we have 45 taxis in our fleet and we want custom high-durability tags.', status: 'Pending', date: '2026-07-16' },
    { id: 'ENQ-202', name: 'Alice Smith', email: 'alice@gmail.com', phone: '+1 555-098-1122', subject: 'Sticker shipping inquiry', message: 'Does shipping take longer than 3 days to Texas?', status: 'Resolved', date: '2026-07-15' },
    { id: 'ENQ-203', name: 'Bob Johnson', email: 'bob.j@corp.com', phone: '+1 555-123-4567', subject: 'Refund request', message: 'I purchased the annual premium, but my car was sold. Can I get a partial refund?', status: 'Pending', date: '2026-07-14' }
  ]);

  // Gateways status
  gateways = signal([
    { name: 'Primary Database (PostgreSQL)', status: 'online', latency: '12ms', cpu: '14%', load: 'Normal' },
    { name: 'Cache Cluster (Redis)', status: 'online', latency: '2ms', cpu: '8%', load: 'Low' },
    { name: 'Message Queue (RabbitMQ)', status: 'online', latency: '5ms', cpu: '11%', load: 'Normal' },
    { name: 'Assets Storage (AWS S3)', status: 'online', latency: '45ms', cpu: 'N/A', load: 'Normal' },
    { name: 'Email Gateway (SendGrid)', status: 'online', latency: '120ms', cpu: 'N/A', load: 'Normal' },
    { name: 'SMS Gateway (Twilio)', status: 'online', latency: '98ms', cpu: 'N/A', load: 'Normal' }
  ]);

  // Generate tag modal fields
  showGenerateModal = signal(false);
  bulkQuantity = signal(10);
  prefix = signal('TT');

  // Search & Filter state
  userSearchQuery = signal('');
  userRoleFilter = signal('all');
  userPlanFilter = signal('all');
  userStatusFilter = signal('all');

  tagSearchQuery = signal('');
  tagStatusFilter = signal('all');

  // Computed filtered users
  filteredUsers = computed(() => {
    const query = this.userSearchQuery().toLowerCase();
    const role = this.userRoleFilter();
    const plan = this.userPlanFilter();
    const status = this.userStatusFilter();

    return this.users().filter(u => {
      const matchesSearch = !query || 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query) ||
        (u.phone && u.phone.includes(query));

      const matchesRole = role === 'all' || u.role.toLowerCase() === role.toLowerCase();
      const matchesPlan = plan === 'all' || u.plan.toLowerCase().includes(plan.toLowerCase());
      const matchesStatus = status === 'all' || u.status.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesRole && matchesPlan && matchesStatus;
    });
  });

  // Computed filtered tags
  filteredTags = computed(() => {
    const query = this.tagSearchQuery().toLowerCase();
    const status = this.tagStatusFilter();

    return this.tags().filter(t => {
      const matchesSearch = !query || 
        t.serial.toLowerCase().includes(query) || 
        t.ownerEmail.toLowerCase().includes(query) || 
        t.plate.toLowerCase().includes(query);

      const matchesStatus = status === 'all' || t.status.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const sub = params.get('subpage');
      if (sub && ['dashboard', 'users', 'memberships', 'tags', 'enquiries', 'gateways', 'profile'].includes(sub)) {
        this.activeTab.set(sub as any);
      } else {
        this.router.navigate(['/admin', 'dashboard'], { replaceUrl: true });
      }
    });

    this.loadStats();
    this.loadPlans();
  }

  loadStats() {
    this.http.get<any>(`${API_BASE_URL}/api/Admin/dashboard/stats`).subscribe({
      next: (res) => {
        if (res) {
          this.totalUsersCount.set(res.totalUsers);
          this.totalVehiclesCount.set(res.totalVehicles);
          this.totalTagsCount.set(res.totalQrsGenerated);
          this.membershipRevenue.set(res.totalPaymentsCollected || 0);
          this.notificationsTodayCount.set(res.totalEmailsSent);
          
          this.activeUsersCount.set(res.totalUsers); 
        }
      },
      error: (err) => console.error('Failed to load admin stats', err)
    });

    this.http.get<any[]>(`${API_BASE_URL}/api/Admin/qr/inventory`).subscribe({
      next: (res) => {
        if (res) {
          this.tags.set(res);
        }
      },
      error: (err) => console.error('Failed to load tags inventory', err)
    });
  }

  selectTab(tab: 'dashboard' | 'users' | 'memberships' | 'tags' | 'enquiries' | 'gateways' | 'profile') {
    this.activeTab.set(tab);
    this.isMobileSidebarOpen.set(false);
    this.router.navigate(['/admin', tab]);
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

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update(v => !v);
  }

  downloadingTagId = signal<string | null>(null);

  downloadQrPdf(tag: AdminTag) {
    this.downloadingTagId.set(tag.serial);
    const scanUrl = tag.qrValue || (window.location.origin + '/scan/' + tag.uniqueCode);
    
    // Create a dummy vehicle to pass to QrDecalService
    const dummyVehicle = {
      id: tag.uniqueCode,
      make: tag.plate === 'N/A' ? 'Unassigned' : 'TraffTag',
      model: 'Tag',
      plate: tag.plate === 'N/A' ? 'PENDING' : tag.plate,
      tagId: tag.serial,
      image: ''
    };

    this.http.get(`${API_BASE_URL}/api/v1/qrtags/${encodeURIComponent(tag.serial)}/image`, {
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        if (blob && blob.size > 0 && blob.type.startsWith('image/')) {
          this.qrDecalService.generateAndDownloadPdfWithFrame(dummyVehicle, blob)
            .then(() => this.downloadingTagId.set(null))
            .catch(() => this.downloadingTagId.set(null));
        } else {
          this.qrDecalService.generateAndDownloadCanvasQr(dummyVehicle, tag.serial, scanUrl)
            .then(() => this.downloadingTagId.set(null));
        }
      },
      error: () => {
        this.qrDecalService.generateAndDownloadCanvasQr(dummyVehicle, tag.serial, scanUrl)
          .then(() => this.downloadingTagId.set(null));
      }
    });
  }

  generateTagsBulk() {
    const qty = Number(this.bulkQuantity());
    const payload = {
      Count: qty,
      BaseUrl: window.location.origin + '/scan/'
    };

    this.http.post<any>(`${API_BASE_URL}/api/Admin/qr/bulk-generate`, payload).subscribe({
      next: (res) => {
        // Update total tags count
        this.totalTagsCount.update(val => val + qty);
        this.showGenerateModal.set(false);
        this.loadStats();

        alert(`Successfully generated ${qty} tags for Batch ${res.batchNumber}! You can now download them as PDFs from the inventory list.`);
      },
      error: (err) => {
        console.error('Failed to bulk generate tags', err);
        alert('Failed to generate tags.');
      }
    });
  }

  toggleUserStatus(userId: string) {
    this.users.update(list => {
      return list.map(u => {
        if (u.id === userId) {
          const nextStatus = u.status === 'Active' ? 'Suspended' : ('Active' as const);
          return { ...u, status: nextStatus };
        }
        return u;
      });
    });
  }

  updateTagStatus(serial: string, nextStatus: 'Active' | 'Inactive' | 'Lost/Stolen') {
    this.tags.update(list => {
      return list.map(t => {
        if (t.serial === serial) {
          return { ...t, status: nextStatus };
        }
        return t;
      });
    });
  }

  resolveEnquiry(enqId: string) {
    this.enquiries.update(list =>
      list.map(e => e.id === enqId ? { ...e, status: 'Resolved' } : e)
    );
  }

  // --- Memberships Logic ---
  activePlans = signal<any[]>([]);
  membershipTypes = signal<any[]>([]);
  showPlanModal = signal(false);
  isCreatingPlan = signal(false);
  newPlan = signal({
    name: '',
    price: null,
    credits: null,
    validityDays: null,
    membershipTypeId: 1
  });

  loadPlans() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };
    this.http.get<{success: boolean, data: any[]}>(`${API_BASE_URL}/api/v1/memberships/plans/admin`, { headers }).subscribe({
      next: (res) => {
        if (res.success) {
          this.activePlans.set(res.data);
        }
      },
      error: (err) => console.error('Failed to load plans', err)
    });
    
    this.http.get<{success: boolean, data: any[]}>(`${API_BASE_URL}/api/v1/memberships/types`, { headers }).subscribe({
      next: (res) => {
        if (res.success) {
          this.membershipTypes.set(res.data);
          if (res.data.length > 0) {
            this.newPlan.update(p => ({ ...p, membershipTypeId: res.data[0].id }));
          }
        }
      },
      error: (err) => console.error('Failed to load membership types', err)
    });
  }

  togglePlanStatus(planId: number) {
    const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };
    this.http.put(`${API_BASE_URL}/api/v1/memberships/plans/${planId}/toggle-status`, {}, { headers }).subscribe({
      next: (res) => {
        this.loadPlans();
      },
      error: (err) => {
        console.error('Failed to toggle plan status', err);
        alert('Failed to toggle plan status.');
      }
    });
  }

  createPlan() {
    this.isCreatingPlan.set(true);
    const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };
    this.http.post(`${API_BASE_URL}/api/v1/memberships/plans`, this.newPlan(), { headers }).subscribe({
      next: (res) => {
        this.isCreatingPlan.set(false);
        this.showPlanModal.set(false);
        alert('Plan created successfully!');
        this.loadPlans();
      },
      error: (err) => {
        this.isCreatingPlan.set(false);
        console.error('Failed to create plan', err);
        alert('Failed to create plan. Make sure you have Admin rights and the SQL tables exist.');
      }
    });
  }
}



