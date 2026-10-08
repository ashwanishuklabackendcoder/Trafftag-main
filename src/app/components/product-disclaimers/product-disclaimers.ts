import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-product-disclaimers',
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './product-disclaimers.html',
  styleUrl: './product-disclaimers.css'
})
export class ProductDisclaimers {}

