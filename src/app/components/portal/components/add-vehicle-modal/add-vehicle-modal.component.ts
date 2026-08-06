import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-vehicle-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-vehicle-modal.component.html',
  styleUrl: './add-vehicle-modal.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AddVehicleModalComponent implements OnChanges {
  @Input() show = false;
  @Input() makes: any[] = [];
  @Input() models: any[] = [];
  @Input() selectedMakeId = '';
  @Input() selectedModelId = '';
  @Input() newYear = 2025;
  @Input() newPlate = '';
  @Input() newColor = '';
  @Input() newStateProvince = '';
  @Input() newCity = '';
  @Input() newVin = '';
  @Input() newDriverName = '';
  @Input() usStates: any[] = [];
  @Input() usCities: any[] = [];
  @Input() colorPresets: any[] = [];

  @Output() selectedMakeIdChange = new EventEmitter<string>();
  @Output() selectedModelIdChange = new EventEmitter<string>();
  @Output() newYearChange = new EventEmitter<number>();
  @Output() newPlateChange = new EventEmitter<string>();
  @Output() newColorChange = new EventEmitter<string>();
  @Output() newStateProvinceChange = new EventEmitter<string>();
  @Output() newCityChange = new EventEmitter<string>();
  @Output() newVinChange = new EventEmitter<string>();
  @Output() newDriverNameChange = new EventEmitter<string>();

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['show'] && changes['show'].currentValue) {
      if (!this.selectedMakeId) this.makeSearchQuery = '';
      if (!this.selectedModelId) this.modelSearchQuery = '';
      if (!this.newStateProvince) this.stateSearchQuery = '';
      if (!this.newCity) this.citySearchQuery = '';
    }
  }

  onMakeChange(makeId: string) {
    this.selectedMakeIdChange.emit(makeId);
    this.selectedModelIdChange.emit('');
    this.modelSearchQuery = '';
  }

  // Searchable Dropdown State for "Make"
  showMakeDropdown = false;
  makeSearchQuery = '';

  get filteredMakes() {
    if (!this.makeSearchQuery) return this.makes;
    const query = this.makeSearchQuery.toLowerCase();
    return this.makes.filter(m => m.name.toLowerCase().includes(query));
  }

  selectMake(makeId: string, makeName: string) {
    this.onMakeChange(makeId);
    this.makeSearchQuery = makeName;
    this.showMakeDropdown = false;
  }

  getMakeName(makeId: string): string {
    const m = this.makes.find(x => x.id === makeId);
    return m ? m.name : '';
  }

  // Searchable Dropdown State for "Model"
  showModelDropdown = false;
  modelSearchQuery = '';

  get filteredModels() {
    if (!this.modelSearchQuery) return this.models;
    const query = this.modelSearchQuery.toLowerCase();
    return this.models.filter(m => m.name.toLowerCase().includes(query));
  }

  selectModel(modelId: string, modelName: string) {
    this.selectedModelIdChange.emit(modelId);
    this.modelSearchQuery = modelName;
    this.showModelDropdown = false;
  }

  getModelName(modelId: string): string {
    const m = this.models.find(x => x.id === modelId);
    return m ? m.name : '';
  }

  // Searchable Dropdown State for "State"
  showStateDropdown = false;
  stateSearchQuery = '';

  get filteredStates() {
    if (!this.stateSearchQuery) return this.usStates;
    const query = this.stateSearchQuery.toLowerCase();
    return this.usStates.filter(s => s.name.toLowerCase().includes(query) || s.isoCode.toLowerCase().includes(query));
  }

  selectState(stateCode: string, stateName: string) {
    this.newStateProvinceChange.emit(stateCode);
    this.stateSearchQuery = stateName; // Reflect selected name
    this.showStateDropdown = false;
  }

  getStateName(code: string): string {
    const s = this.usStates.find(x => x.isoCode === code);
    return s ? s.name : '';
  }

  // Searchable Dropdown State for "City"
  showCityDropdown = false;
  citySearchQuery = '';

  get filteredCities() {
    if (!this.citySearchQuery) return this.usCities;
    const query = this.citySearchQuery.toLowerCase();
    return this.usCities.filter(c => c.name.toLowerCase().includes(query));
  }

  selectCity(cityName: string) {
    this.newCityChange.emit(cityName);
    this.citySearchQuery = cityName;
    this.showCityDropdown = false;
  }
}
