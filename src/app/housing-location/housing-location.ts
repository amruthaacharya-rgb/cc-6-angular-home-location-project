import { Component, HostBinding, inject, Input, input } from '@angular/core';
import { HousingLocationInfo } from '../types/housing-location-interface';
import { Router, RouterModule } from '@angular/router';
import { HousingService } from '../Services/housing-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-housing-location',
  imports: [RouterModule, DatePipe],
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
