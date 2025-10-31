import { Component, HostBinding, inject, Input, input, output } from '@angular/core';
import { HousingLocationInfo } from '../types/housing-location-interface';
import { Router } from '@angular/router';
import { HousingService } from '../Services/housing-service';

@Component({
  selector: 'app-housing-location',
  imports: [],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css',
})
export class HousingLocation {

  private housingService = inject(HousingService);
  private router = inject(Router);

  locationInfo = input.required<HousingLocationInfo>();

  @Input()
  @HostBinding('class.is-checked')

  get isChecked() {
    return this.housingService.isSelected(this.locationInfo().id);
  }

  get getHousingLocation(): HousingLocationInfo | null {
    return this.housingService.getHousingLocationById(this.locationInfo().id);
  }

  onToggleSelectionChange() {
    const id = this.locationInfo().id;
    this.housingService.toggleSelection(id);
  }

  goToDetails(event: MouseEvent) {
    const id = this.locationInfo().id;
    this.router.navigate(['/home', id]);
  }

}
