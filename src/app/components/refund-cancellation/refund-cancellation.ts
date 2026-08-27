import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-refund-cancellation',
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './refund-cancellation.html',
  styleUrl: '../terms-of-service/terms-of-service.css'
})
export class RefundCancellation {}
