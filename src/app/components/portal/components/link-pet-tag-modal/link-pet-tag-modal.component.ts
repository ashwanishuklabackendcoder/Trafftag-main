import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-link-pet-tag-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './link-pet-tag-modal.component.html',
  styleUrl: './link-pet-tag-modal.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LinkPetTagModalComponent {
  @Input() show = false;
  @Input() isLinkingTag = false;
  @Input() linkSerial = '';
  @Input() linkPetId = '';
  @Input() pets: any[] = [];
  @Input() unassignedTags: any[] = [];

  @Output() linkSerialChange = new EventEmitter<string>();
  @Output() linkPetIdChange = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  showDropdown = false;

  get filteredTags() {
    if (!this.linkSerial) return this.unassignedTags;
    return this.unassignedTags.filter(t => 
      t.tagId.toLowerCase().includes(this.linkSerial.toLowerCase())
    );
  }

  selectTag(tagId: string) {
    this.linkSerial = tagId;
    this.linkSerialChange.emit(tagId);
    this.showDropdown = false;
  }
}
