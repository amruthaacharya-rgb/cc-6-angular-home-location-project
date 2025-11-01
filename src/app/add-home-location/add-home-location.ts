import { Component, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HousingService } from '../Services/housing-service';
import { HousingLocationInfo } from '../types/housing-location-interface';
import { Highlight } from '../Directives/highlight';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-home-location',
  standalone: true,
  imports: [ReactiveFormsModule, Highlight],
  templateUrl: './add-home-location.html',
  styleUrl: './add-home-location.css',
})
export class AddHomeLocation {
  isOpen = signal(true);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private housingService = inject(HousingService);

  constructor(private toastr: ToastrService) { }


  locationForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(6)]],
    city: ['', Validators.required],
    state: ['', Validators.required],
    availableUnits: [0, [Validators.required, Validators.min(1)]],
    wifi: [false],
    laundry: [false],
    isPremium: [false],
  });
  submitted = false;

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
      id: allHousingLocations.length,
      photo: 'angular.svg',
      ...formValue,
    } as HousingLocationInfo;

    this.housingService.addHousingLocation(newLocation);
    this.toastr.success('Home location added suucessfully!', 'Success');

    this.locationForm.reset();

    setTimeout(() => this.closeSidebar(), 1500);
  }

  get hasUnsavedChanges(): boolean {
    return this.locationForm.dirty && !this.submitted;
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBrowserRefresh(event: BeforeUnloadEvent) {
    if (this.hasUnsavedChanges) {
      event.preventDefault();
    }
  }

  closeSidebar(): void {
    if (this.hasUnsavedChanges) {
      // this.snackbar.showError('You have unsaved changes. Do you really want to close and lose your data?')
      this.toastr.error('You have unsaved changes. Do you really want to close and lose your data?', 'Error');
    }
    this.isOpen.update((v) => !v);
    this.router.navigate(['/home']);
  }
}
