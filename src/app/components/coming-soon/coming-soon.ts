import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterLink, NavbarComponent],
  templateUrl: './coming-soon.html',
  styleUrls: ['./coming-soon.css']
})
export class ComingSoon {}

