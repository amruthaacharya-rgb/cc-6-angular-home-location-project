import { Component, computed, inject, signal } from '@angular/core';
import { HousingLocation } from '../housing-location/housing-location';
import { HousingService } from '../Services/housing-service';
import { CardWrapper } from '../card-wrapper/card-wrapper';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from "@angular/router";


@Component({
  selector: 'app-home',
  imports: [CommonModule, HousingLocation, CardWrapper, RouterOutlet],

  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private housingService: HousingService = inject(HousingService);

  allHousingLocations = this.housingService.housingLocations;

  searchText = signal('');

  performSearch() {
    this.searchText.set(this.searchText());
  }

  filteredLocationList = computed(() =>
    this.allHousingLocations().filter(housingLocation =>
      housingLocation.city.toLowerCase().includes(this.searchText().toLowerCase())
    )
  );
}
