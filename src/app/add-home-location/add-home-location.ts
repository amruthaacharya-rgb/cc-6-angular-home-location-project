import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HousingService } from '../Services/housing-service';
import { HousingLocationInfo } from '../types/housing-location-interface';
import { Highlight } from '../Directives/highlight';
import { ToastrService } from 'ngx-toastr';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-add-home-location',
  standalone: true,
  imports: [ReactiveFormsModule, Highlight],
  templateUrl: './add-home-location.html',
  styleUrl: './add-home-location.css',
  host: {
    '(window:beforeunload)': 'onBeforeUnload($event)',
  },
})
export class AddHomeLocation {

  isOpen = signal(true);
  id = input<string | null>(null);
  useUploadMode = signal(false);
  isDragOver = signal(false);
  photoPreview = signal<string | null>(null);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private housingService = inject(HousingService);
  private toaster = inject(ToastrService);
  private dialog = inject(Dialog);

  numericId = computed(() => (this.id() ? Number(this.id()) : null));
  isEditMode = computed(() => this.numericId() !== null);
  housingLocationComputed = computed(() =>
    this.housingService.getHousingLocationById(this.numericId())
  );

  constructor() {
    effect(() => {
      const location = this.housingLocationComputed();
      if (this.isEditMode() && location) {
        this.locationForm.patchValue(location);
      }
      if (location?.photo) {
        this.photoPreview.set(location.photo);
      }
    });
  }

  locationForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(6)]],
    city: ['', Validators.required],
    state: ['', Validators.required],
    photo: [''],
    availableUnits: [0, [Validators.required, Validators.min(1)]],
    wifi: [false],
    laundry: [false],
    isPremium: [false],
  });

  submitted = false;

  toggleUploadMode() {
    this.useUploadMode.update((v) => !v);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleFile(file);
  }

  private handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.photoPreview.set(result);
      this.locationForm.patchValue({ photo: result });
    };
    reader.readAsDataURL(file);
  }

  updateUrlPreview() {
    const url = this.locationForm.get('photo')?.value;
    if (url && this.isValidImageUrl(url)) {
      this.photoPreview.set(url);
    } else {
      this.photoPreview.set(null);
    }
  }

  private isValidImageUrl(url: string): boolean {
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  }

  clearPhoto() {
    this.photoPreview.set(null);
    this.locationForm.patchValue({ photo: '' });
  }

  private isDuplicateName(name: string | null | undefined): boolean {
    if (!name) return false;

    const trimmedName = name.trim().toLowerCase();
    const allHousingLocations = this.housingService.getAllHousingLocations();

    return allHousingLocations.some(
      (loc) => loc.name.trim().toLowerCase() === trimmedName
    );
  }

  onSubmit(): void {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      const firstInvalid = document.querySelector('.ng-invalid');
      if (firstInvalid) {
        (firstInvalid as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      return;
    }

    const formValue = this.locationForm.value;

    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: this.isEditMode() ? 'Confirm Update' : 'Confirm Add',
        message: this.isEditMode()
          ? 'Are you sure you want to update this home location?'
          : 'Are you sure you want to add this new home location?',
      },
    });

    dialogRef.closed.subscribe((confirmed) => {
      if (!confirmed) return;
      if (this.isEditMode()) {
        const updatedLocation: HousingLocationInfo = {
          ...(this.housingLocationComputed() as HousingLocationInfo),
          name: formValue.name ?? '',
          city: formValue.city ?? '',
          state: formValue.state ?? '',
          photo: formValue.photo ?? '',
          availableUnits: formValue.availableUnits ?? 0,
          wifi: formValue.wifi ?? false,
          laundry: formValue.laundry ?? false,
          isPremium: formValue.isPremium ?? false,
          dateAdded: new Date().toLocaleDateString('en-GB'),
        };
        this.housingService.updateHousingLocation(updatedLocation);
        this.toaster.success('Home location updated successfully!', 'Updated');
      } else {
        if (this.isDuplicateName(formValue.name)) {
          this.locationForm.get('name')?.setErrors({ nameExists: true });
          return;
        }

        const allHousingLocations = this.housingService.getAllHousingLocations();
        const newLocation: HousingLocationInfo = {
          id: allHousingLocations.length,
          ...formValue,
          dateAdded: new Date().toLocaleDateString('en-GB'),
        } as HousingLocationInfo;


        console.log('✅ New Home Location added:', newLocation);

        this.housingService.addHousingLocation(newLocation);

        console.log('📦 All housing locations after add:', this.housingService.getAllHousingLocations());
        this.toaster.success('Home location added successfully!', 'Success');
      }

      this.submitted = true;
      this.locationForm.reset();
      this.photoPreview.set(null);
      setTimeout(() => this.closeSidebar(), 1500);
    });
  }

  get hasUnsavedChanges(): boolean {
    return this.locationForm.dirty && !this.submitted;
  }

  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.hasUnsavedChanges) {
      event.preventDefault();
    }
  }

  closeSidebar(): void {
    if (this.hasUnsavedChanges) {
      const dialogRef = this.dialog.open(ConfirmDialog, {
        data: {
          title: 'Unsaved Changes',
          message:
            'You have unsaved changes. Do you really want to close and lose your data?',
        },
      });

      dialogRef.closed.subscribe((confirmed) => {
        if (confirmed) {
          this.performClose();
          this.toaster.error('You closed an unsaved Form', 'Error');
        }
      });
    } else {
      this.performClose();
    }
  }

  private performClose(): void {
    this.isOpen.update((v) => !v);
    this.router.navigate(['/home']);
  }
}
