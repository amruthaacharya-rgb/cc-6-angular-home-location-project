import { Injectable, signal, WritableSignal } from '@angular/core';
import { HousingLocationInfo } from '../types/housing-location-interface';

@Injectable({
  providedIn: 'root'
})

export class HousingService {
  readonly baseUrl = 'https://angular.dev/assets/images/tutorials/common';

  private readonly _housingLocations: WritableSignal<HousingLocationInfo[]> = signal([
    {
      id: 0,
      name: 'Acme Fresh Start Housing',
      city: 'Chicago',
      state: 'IL',
      photo: `${this.baseUrl}/bernard-hermant-CLKGGwIBTaY-unsplash.jpg`,
      availableUnits: 4,
      wifi: true,
      laundry: true,
      isPremium: false
    },
    {
      id: 1,
      name: 'A113 Transitional Housing',
      city: 'Santa Monica',
      state: 'CA',
      photo: `${this.baseUrl}/brandon-griggs-wR11KBaB86U-unsplash.jpg`,
      availableUnits: 0,
      wifi: false,
      laundry: true,
      isPremium: false
    },
    {
      id: 2,
      name: 'Warm Beds Housing Support',
      city: 'Juneau',
      state: 'AK',
      photo: `${this.baseUrl}/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg`,
      availableUnits: 1,
      wifi: false,
      laundry: false,
      isPremium: false
    },
    {
      id: 3,
      name: 'Homesteady Housing',
      city: 'Chicago',
      state: 'IL',
      photo: `${this.baseUrl}/ian-macdonald-W8z6aiwfi1E-unsplash.jpg`,
      availableUnits: 1,
      wifi: true,
      laundry: false,
      isPremium: true
    },
    {
      id: 4,
      name: 'Happy Homes Group',
      city: 'Gary',
      state: 'IN',
      photo: `${this.baseUrl}/krzysztof-hepner-978RAXoXnH4-unsplash.jpg`,
      availableUnits: 1,
      wifi: true,
      laundry: false,
      isPremium: false
    },
    {
      id: 5,
      name: 'Hopeful Apartment Group',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/r-architecture-JvQ0Q5IkeMM-unsplash.jpg`,
      availableUnits: 2,
      wifi: true,
      laundry: true,
      isPremium: false
    },
    {
      id: 6,
      name: 'Seriously Safe Towns',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/phil-hearing-IYfp2Ixe9nM-unsplash.jpg`,
      availableUnits: 5,
      wifi: true,
      laundry: true,
      isPremium: true
    },
    {
      id: 7,
      name: 'Hopeful Housing Solutions',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/r-architecture-GGupkreKwxA-unsplash.jpg`,
      availableUnits: 2,
      wifi: true,
      laundry: true,
      isPremium: false
    },
    {
      id: 8,
      name: 'Seriously Safe Towns',
      city: 'Oakland',
      state: 'CA',
      photo: `${this.baseUrl}/saru-robert-9rP3mxf8qWI-unsplash.jpg`,
      availableUnits: 10,
      wifi: false,
      laundry: false,
      isPremium: false
    },
    {
      id: 9,
      name: 'Capital Safe Towns',
      city: 'Portland',
      state: 'OR',
      photo: `${this.baseUrl}/webaliser-_TPTXZd9mOo-unsplash.jpg`,
      availableUnits: 6,
      wifi: true,
      laundry: true,
      isPremium: true
    },
  ]);

  readonly housingLocations = this._housingLocations.asReadonly();

  getAllHousingLocations(): HousingLocationInfo[] {
    return this._housingLocations();
  }

  getHousingLocationById(id: number | null): HousingLocationInfo | null {
    if (id === null || isNaN(Number(id))) return null;
    return this._housingLocations().find(loc => loc.id === Number(id)) || null;
  }

  private _selectedLocations = signal<number[]>([]);
  readonly selectedLocations = this._selectedLocations.asReadonly();

  isSelected(id: number) {
    return this.selectedLocations().includes(id);
  }

  toggleSelection(id: number) {
    if (this.isSelected(id)) {
      this._selectedLocations.update(list => list.filter(x => x !== id));
    } else {
      this._selectedLocations.update(list => [...list, id]);
    }
  }

  applyPremiumToggle() {
    const selectedIds = this.selectedLocations();
    this._housingLocations.update((list) =>
      list.map((loc) => selectedIds.includes(loc.id) ? { ...loc, isPremium: !loc.isPremium } : loc)
    );
  }

  shuffleLocations() {
    this._housingLocations.update((list) => {
      const shuffled = [...list];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    })
  }

  deleteLocations() {
    const selectedIds = this.selectedLocations();
    this._housingLocations.update((list) =>
      list.filter(house => !selectedIds.includes(house.id))
    );
    this._selectedLocations.set([]);
  }

  getPrevious(currentId: number | null): number | null {
    if (currentId === null) return null;
    const all = this._housingLocations();
    const index = all.findIndex(loc => loc.id === currentId);
    if (index > 0) {
      return all[index - 1].id;
    }
    return null;
  }

  getNext(currentId: number | null): number | null {
    if (currentId === null) return null;
    const all = this._housingLocations();
    const index = all.findIndex(loc => loc.id === currentId);
    if (index >= 0 && index < all.length - 1) {
      return all[index + 1].id;
    }
    return null;
  }

  addHousingLocation(newLocation: HousingLocationInfo){
    const updated = [...this._housingLocations(), newLocation]
    this._housingLocations.set(updated);
  }
}
