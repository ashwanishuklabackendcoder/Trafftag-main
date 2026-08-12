import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterLink, NavbarComponent],
  templateUrl: './terms-of-service.html',
  styleUrls: ['./terms-of-service.css']
})
export class TermsOfService {}

