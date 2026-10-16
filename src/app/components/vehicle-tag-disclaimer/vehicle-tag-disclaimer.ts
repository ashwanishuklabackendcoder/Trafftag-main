import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-vehicle-tag-disclaimer',
  imports: [RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './vehicle-tag-disclaimer.html',
  styleUrl: '../terms-of-service/terms-of-service.css'
})
export class VehicleTagDisclaimer {}
