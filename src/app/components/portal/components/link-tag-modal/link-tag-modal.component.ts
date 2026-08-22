import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-link-tag-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './link-tag-modal.component.html',
  styleUrl: './link-tag-modal.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LinkTagModalComponent {
  @Input() show = false;
  @Input() linkSerial = '';
  @Input() linkVehicleId = '';
  @Input() vehicles: any[] = [];
  @Input() unassignedTags: any[] = [];
  @Input() qrImageBase64: string | null = null;
  @Input() isLinkingTag = false;

  @Output() linkSerialChange = new EventEmitter<string>();
  @Output() linkVehicleIdChange = new EventEmitter<string>();

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  // Dropdown state
  showDropdown = false;
  
  get filteredTags() {
    if (!this.linkSerial) return this.unassignedTags;
    const lowerSearch = this.linkSerial.toLowerCase();
    return this.unassignedTags.filter(tag => 
      tag.tagId?.toLowerCase().includes(lowerSearch)
    );
  }

  selectTag(tagId: string) {
    this.linkSerialChange.emit(tagId);
    this.showDropdown = false;
  }
}
