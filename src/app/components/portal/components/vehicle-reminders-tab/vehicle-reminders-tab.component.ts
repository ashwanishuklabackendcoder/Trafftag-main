import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle-reminders-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-reminders-tab.component.html',
  styleUrl: './vehicle-reminders-tab.component.css',
  encapsulation: ViewEncapsulation.None
})
export class VehicleRemindersTabComponent {
  months = ['01 - January', '02 - February', '03 - March', '04 - April', '05 - May', '06 - June', '07 - July', '08 - August', '09 - September', '10 - October', '11 - November', '12 - December'];
  years = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];

  regDate = '2025-07-31';
  reg60 = true; reg30 = true; reg7 = true; regOn = true; regAfter = false;
  regEnabled = true;

  inspMonth = '10 - October'; inspYear = '2025';
  insp60 = true; insp30 = true; insp7 = true; inspOn = true; inspAfter = false;
  inspEnabled = true;

  insDate = '2025-08-15';
  ins60 = true; ins30 = true; ins7 = true; insOn = true; insAfter = false;
  insEnabled = true;

  licDate = '2026-09-20';
  lic60 = true; lic30 = true; lic7 = true; licOn = true;
  licEnabled = true;

  ezDate = '2025-06-30';
  ez30 = true; ez7 = true; ezOn = true;
  ezEnabled = true;

  otherName = '';
  otherDate = '';
  otherEnabled = false;

  notifySms = true;
  notifyEmail = false;
  notifyWhatsapp = false;
  notifyAll = false;

  selectMethod(method: string) {
    this.notifySms = method === 'sms';
    this.notifyEmail = method === 'email';
    this.notifyWhatsapp = method === 'whatsapp';
    this.notifyAll = method === 'all';
  }
}
