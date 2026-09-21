import { Component, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../config/api.config';

import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private router = inject(Router);
  private http = inject(HttpClient);

  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  nickname = signal('');
  phoneNumber = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  agreeTerms = signal(false);
  is18Plus = signal(false);
  privacyAccepted = signal(false);
  smsConsent = signal(false);
  marketingConsent = signal(false);
  transactionalConsent = signal(false);

  isSubmitting = signal(false);
  errorMessage = signal('');
  togglePasswordVisibility() {
    this.showPassword.update(show => !show);
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.update(show => !show);
  }

  submitRegister() {
    if (
      !this.email() ||
      !this.password() ||
      !this.confirmPassword() ||
      !this.nickname() ||
      !this.phoneNumber()
    ) {
      this.errorMessage.set('Please fill out all required fields.');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    if (!this.agreeTerms() || !this.privacyAccepted()) {
      this.errorMessage.set('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    if (!this.is18Plus()) {
      this.errorMessage.set('You must confirm that you are 18 years or older.');
      return;
    }

    if (!this.transactionalConsent()) {
      this.errorMessage.set('You must consent to receive Transactional Messages (Vehicle Alerts).');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const body = {
      email: this.email().trim(),
      password: this.password(),
      nickname: this.nickname().trim(),
      phoneNumber: this.phoneNumber().trim(),
      is18Plus: this.is18Plus(),
      termsAccepted: this.agreeTerms(),
      privacyAccepted: this.privacyAccepted(),
      smsConsent: this.transactionalConsent(),
      marketingConsent: this.marketingConsent()
    };

    this.http.post<any>(`${API_BASE_URL}/api/v1/auth/register`, body)
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          const token = res?.token || res?.accessToken || res?.data?.token || res?.data?.accessToken;
          if (token) {
            localStorage.setItem('accessToken', token);
          }
          const refreshToken = res?.refreshToken || res?.data?.refreshToken;
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
          localStorage.setItem('otpEmail', this.email());
          this.router.navigate(['/verify-otp']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          const msg = err?.error?.message || err?.error?.Message || err?.error || 'Registration failed. Please check your inputs or network.';
          this.errorMessage.set(typeof msg === 'string' ? msg : 'Registration failed. Please check your inputs or network.');
        }
      });
  }
}
