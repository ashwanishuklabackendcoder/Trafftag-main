import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-pet-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-pet-modal.component.html',
  styleUrl: './add-pet-modal.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AddPetModalComponent {
  @Input() show = false;
  @Input() isRegistering = false;
  
  @Input() newName = '';
  @Input() newSpecies = 'Dog';
  @Input() newBreed = '';
  @Input() newNotes = '';

  @Output() newNameChange = new EventEmitter<string>();
  @Output() newSpeciesChange = new EventEmitter<string>();
  @Output() newBreedChange = new EventEmitter<string>();
  @Output() newNotesChange = new EventEmitter<string>();

  @Output() close = new EventEmitter<void>();
  @Output() submitPet = new EventEmitter<void>();
}
