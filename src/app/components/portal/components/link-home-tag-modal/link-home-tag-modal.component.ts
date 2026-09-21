import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-link-home-tag-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './link-home-tag-modal.component.html',
  styleUrl: './link-home-tag-modal.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LinkHomeTagModalComponent {
  @Input() show = false;
  @Input() linkSerial = '';
  @Input() linkHomeId = '';
  @Input() homes: any[] = [];
  @Input() unassignedTags: any[] = [];
  @Input() isLinkingTag = false;

  @Output() linkSerialChange = new EventEmitter<string>();
  @Output() linkHomeIdChange = new EventEmitter<string>();

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

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
