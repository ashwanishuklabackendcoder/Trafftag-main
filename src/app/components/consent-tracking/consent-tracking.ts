import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-consent-tracking',
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './consent-tracking.html',
  styleUrl: '../terms-of-service/terms-of-service.css'
})
export class ConsentTracking {}
