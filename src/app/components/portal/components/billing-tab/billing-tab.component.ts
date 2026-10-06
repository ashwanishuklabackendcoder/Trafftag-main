import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../../config/api.config';

interface PaymentHistory {
  paymentId: number;
  date: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  invoiceUrl: string;
}

@Component({
  selector: 'app-billing-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billing-tab.component.html',
  styleUrls: ['./billing-tab.component.css']
})
export class BillingTabComponent implements OnInit {
  payments = signal<PaymentHistory[]>([]);
  isLoading = signal(true);
  error = signal('');
  
  private http = inject(HttpClient);

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.isLoading.set(true);
    this.http.get<any>(`${API_BASE_URL}/api/v1/payments/history`).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.payments.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load payment history.');
        this.isLoading.set(false);
      }
    });
  }

  downloadInvoice(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
