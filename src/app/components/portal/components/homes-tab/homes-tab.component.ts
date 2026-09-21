import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homes-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homes-tab.component.html',
  styleUrl: './homes-tab.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HomesTabComponent {
  @Input() homes: any[] = [];
  @Input() unassignedTags: any[] = [];
  
  @Output() addHomeClick = new EventEmitter<void>();
  @Output() openLinkTag = new EventEmitter<string>();
  @Output() deleteHome = new EventEmitter<string>();
  @Output() toggleActive = new EventEmitter<any>();
}
