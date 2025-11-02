import { Component, computed, inject, input } from '@angular/core';
import { HousingService } from '../Services/housing-service';
import { HousingLocation } from "../housing-location/housing-location";
import { Router } from '@angular/router';

@Component({
  selector: 'app-housing-location-details',
  imports: [HousingLocation],
  templateUrl: './housing-location-details.html',
  styleUrl: './housing-location-details.css',
})
export class HousingLocationDetails {

  private readonly router = inject(Router);
  private readonly housingService = inject(HousingService);

  id = input<string | null>(null);

  numericId = computed(() => {
    const value = this.id();
    return value !== null ? Number(value) : null;
  });

  housingLocation = computed(() => this.housingService.getHousingLocationById(this.numericId()));

  goToPrevious() {
    const prevId = this.housingService.getPrevious(this.numericId());
    if (prevId !== null) {
      this.router.navigate(['/home', prevId])
    }
  }

  goToNext(): void {
    const nextId = this.housingService.getNext(this.numericId());
    if (nextId !== null) {
      this.router.navigate(['/home', nextId]);
    }
  }

}