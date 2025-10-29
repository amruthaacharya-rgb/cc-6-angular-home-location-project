import { Component, computed, inject, signal } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingLocationInfo } from '../types/housing-location-interface';
import { HousingService } from '../Services/housing-service';
import { CardWrapper } from '../card-wrapper/card-wrapper';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [HousingLocation, CardWrapper, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private housingService: HousingService = inject(HousingService);
  router = inject(Router);
  
  allHousingLocations = this.housingService.housingLocations;
  selectedLocations = this.housingService.selectedLocations;

  constructor() { }

  isSelected = (loc: HousingLocationInfo) => this.housingService.isSelected(loc.id);

  
  shuffleLocations() {
    this.housingService.shuffleLocations();
  }
  
  applyPremiumToggle() {
    this.housingService.applyPremiumToggle();
  }

  deleteLocations() {
    const confirmed = window.confirm('Are you sure you want to delete the selected houses?');
    if (confirmed) {
      this.housingService.deleteLocations();
    }
  }

}
