import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-home-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-home-modal.component.html',
  styleUrl: './add-home-modal.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AddHomeModalComponent {
  @Input() show = false;
  @Input() isRegistering = false;
  
  @Input() newName = '';
  @Input() newAddress = '';

  @Output() newNameChange = new EventEmitter<string>();
  @Output() newAddressChange = new EventEmitter<string>();

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
}
