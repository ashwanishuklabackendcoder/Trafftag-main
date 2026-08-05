import { Component, signal, inject, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../config/api.config';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit, OnDestroy {
  private router = inject(Router);
  private http = inject(HttpClient);

  @ViewChild('sigCanvas') sigCanvas?: ElementRef<HTMLCanvasElement>;

  firstName = signal('');
  lastName = signal('');
  nickname = signal('');
  address = signal('');
  phone = signal('');
  alternatePhone = signal('');
  email = signal('');
  alternateEmail = signal('');
  password = signal('');
  digitalSign = signal('');
  captcha = signal('');
  showPassword = signal(false);
  agreeTerms = signal(false);

  showSignatureModal = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal('');
  hasSignatureInModal = signal(false);

  private isDrawing = false;
  private ctx!: CanvasRenderingContext2D | null;

  ngOnInit() {
    // Expose callback to global window for reCAPTCHA script
    (window as any).onRecaptchaSuccess = (token: string) => {
      this.captcha.set(token);
      this.errorMessage.set('');
    };

    (window as any).onRecaptchaExpired = () => {
      this.captcha.set('');
    };

    // Dynamically load the script if not present
    if (!document.getElementById('recaptcha-script')) {
      const script = document.createElement('script');
      script.id = 'recaptcha-script';
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }

  ngOnDestroy() {
    delete (window as any).onRecaptchaSuccess;
    delete (window as any).onRecaptchaExpired;
  }

  openSignatureModal() {
    this.showSignatureModal.set(true);
    this.hasSignatureInModal.set(!!this.digitalSign());
    setTimeout(() => {
      this.initCanvas();
      if (this.digitalSign()) {
        this.loadExistingSignatureToCanvas(this.digitalSign());
      }
    }, 150);
  }

  closeSignatureModal() {
    this.showSignatureModal.set(false);
  }

  initCanvas() {
    if (!this.sigCanvas) return;
    const canvas = this.sigCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 500;
    canvas.height = rect.height || 180;
    this.ctx = canvas.getContext('2d');
    if (this.ctx) {
      this.ctx.strokeStyle = '#08162A';
      this.ctx.lineWidth = 2.5;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
    }
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.isDrawing = true;
    const pos = this.getCanvasPos(event);
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
    }
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.isDrawing || !this.ctx) return;
    event.preventDefault();
    const pos = this.getCanvasPos(event);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    this.hasSignatureInModal.set(true);
  }

  stopDrawing() {
    if (this.isDrawing) {
      this.isDrawing = false;
    }
  }

  private getCanvasPos(event: MouseEvent | TouchEvent): { x: number; y: number } {
    if (!this.sigCanvas) return { x: 0, y: 0 };
    const canvas = this.sigCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event.touches && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    }

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  clearSignatureCanvas() {
    if (this.sigCanvas && this.ctx) {
      const canvas = this.sigCanvas.nativeElement;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    this.hasSignatureInModal.set(false);
  }

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.errorMessage.set('Please select an image file for digital signature.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.hasSignatureInModal.set(true);
        this.loadExistingSignatureToCanvas(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  private loadExistingSignatureToCanvas(base64: string) {
    const img = new Image();
    img.onload = () => {
      if (this.sigCanvas && this.ctx) {
        const canvas = this.sigCanvas.nativeElement;
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };
    img.src = base64;
  }

  saveSignatureFromModal() {
    if (this.sigCanvas && this.hasSignatureInModal()) {
      const canvas = this.sigCanvas.nativeElement;
      this.digitalSign.set(canvas.toDataURL('image/png'));
    } else {
      this.digitalSign.set('');
    }
    this.closeSignatureModal();
  }

  removeSignature() {
    this.digitalSign.set('');
  }

  togglePasswordVisibility() {
    this.showPassword.update(show => !show);
  }

  submitRegister() {
    if (
      !this.firstName() ||
      !this.lastName() ||
      !this.nickname() ||
      !this.address() ||
      !this.phone() ||
      !this.email() ||
      !this.password() ||
      !this.digitalSign() ||
      !this.captcha()
    ) {
      this.errorMessage.set('Please fill out all required fields and complete the captcha.');
      return;
    }

    if (!this.agreeTerms()) {
      this.errorMessage.set('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    // Parse phone and country code
    let rawPhone = this.phone().trim();
    let countryCode = '+1';
    let phoneNumber = rawPhone;

    if (rawPhone.startsWith('+')) {
      const match = rawPhone.match(/^\+(\d{1,3})/);
      if (match) {
        countryCode = '+' + match[1];
        phoneNumber = rawPhone.substring(match[0].length).trim();
      }
    } else if (rawPhone.length > 0) {
      countryCode = '+1';
    }

    const body = {
      firstName: this.firstName().trim(),
      lastName: this.lastName().trim(),
      nickname: this.nickname().trim(),
      address: this.address().trim(),
      alternatePhone: this.alternatePhone().trim(),
      alternateEmail: this.alternateEmail().trim(),
      digitalSign: this.digitalSign(),
      email: this.email().trim(),
      password: this.password(),
      phoneNumber: phoneNumber,
      countryCode: countryCode,
      captcha: this.captcha().trim()
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
