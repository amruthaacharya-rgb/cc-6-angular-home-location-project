import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HousingService } from './Services/housing-service';
import { HousingLocationInfo } from './types/housing-location-interface';


@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  title = 'HOME';

  private housingService: HousingService = inject(HousingService);
  router = inject(Router);

  allHousingLocations = this.housingService.housingLocations;
  selectedLocations = this.housingService.selectedLocations;

  searchText = signal('');

  constructor(){}
  
  isSelected = (loc: HousingLocationInfo) => this.housingService.isSelected(loc.id);
  
  performSearch() {
    this.searchText.set(this.searchText());
  }

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
