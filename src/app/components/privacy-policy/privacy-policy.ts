import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterLink, NavbarComponent],
  templateUrl: './privacy-policy.html',
  styleUrls: ['./privacy-policy.css']
})
export class PrivacyPolicy {}

