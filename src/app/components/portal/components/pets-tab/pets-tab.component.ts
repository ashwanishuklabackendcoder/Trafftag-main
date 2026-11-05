import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pets-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pets-tab.component.html',
  styleUrl: './pets-tab.component.css',
  encapsulation: ViewEncapsulation.None
})
export class PetsTabComponent {
  @Input() pets: any[] = [];
  @Input() unassignedTags: any[] = [];
  @Input() downloadingVehicleId: string | null = null;
  
  @Output() downloadQr = new EventEmitter<any>();
  @Output() addPetClick = new EventEmitter<void>();
  @Output() openLinkTag = new EventEmitter<string>();
  @Output() deletePet = new EventEmitter<string>();
  @Output() toggleActive = new EventEmitter<any>();

  getSpeciesIcon(species: string): string {
    const s = (species || '').toLowerCase();
    if (s.includes('cat')) return 'fa-solid fa-cat';
    if (s.includes('dog')) return 'fa-solid fa-dog';
    if (s.includes('bird') || s.includes('parrot')) return 'fa-solid fa-dove';
    if (s.includes('rabbit') || s.includes('bunny')) return 'fa-solid fa-paw';
    return 'fa-solid fa-paw';
  }
}
