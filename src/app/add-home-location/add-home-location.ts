import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HousingService } from '../Services/housing-service';
import { HousingLocationInfo } from '../types/housing-location-interface';

@Component({
  selector: 'app-add-home-location',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-home-location.html',
  styleUrl: './add-home-location.css',
})
export class AddHomeLocation {
  isOpen = signal(true);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private housingService = inject(HousingService);

  locationForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(6)]],
    city: ['', Validators.required],
    state: ['', Validators.required],
    availableUnits: [0, [Validators.required, Validators.min(1)]],
    wifi: [false],
    laundry: [false],
    isPremium: [false],
  });

  onSubmit(): void {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      const firstInvalid = document.querySelector('.ng-invalid');
      if (firstInvalid) {
        (firstInvalid as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const formValue = this.locationForm.value;
    const allHousingLocations = this.housingService.getAllHousingLocations();
    const trimmedName = formValue.name?.trim().toLowerCase();

    const nameExists = allHousingLocations.some(
      (loc) => loc.name.trim().toLowerCase() === trimmedName
    );

    if (nameExists) {
      this.locationForm.get('name')?.setErrors({ nameExists: true });
      return;
    }

    const newLocation: HousingLocationInfo = {
      id: allHousingLocations.length + 1,
      photo: 'angular.svg',
      ...formValue,
    } as HousingLocationInfo;

    this.housingService.addHousingLocation(newLocation);

    setTimeout(() => this.toggleSidebar(), 1500);
  }

  toggleSidebar(): void {
    this.isOpen.update((v) => !v);
    this.router.navigate(['/home']);
  }
}
