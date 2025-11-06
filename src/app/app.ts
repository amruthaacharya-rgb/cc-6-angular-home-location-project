import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HousingService } from './Services/housing-service';
import { ConfirmDialog } from './shared/confirm-dialog/confirm-dialog';
import { Dialog } from '@angular/cdk/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit, OnDestroy {

  private dialog = inject(Dialog);
  private toaster = inject(ToastrService)
  private _housingService = inject(HousingService);
  router = inject(Router);

  selectedLocations = this.housingService.selectedLocations;
  
  get housingService() {
    return this._housingService;
  }

  constructor() {
    console.log('%capp constructor()', 'color: gray');
  }

  ngOnInit() {
    console.log('%capp ngOnInit()', 'color: green');
  }

  ngOnDestroy() {
    console.log('%capp ngOnDestroy()', 'color: red');
  }

  toggleSelectAll() {
    this.housingService.toggleSelectAll();
  }

  shuffleLocations() {
    this.housingService.shuffleLocations();
  }

  applyPremiumToggle() {
    this.housingService.applyPremiumToggle();
  }

  deleteLocations(): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete the selected houses? This action cannot be undone.',
      },
    });

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.housingService.deleteLocations();
        this.toaster.success('Selected houses deleted successfully!', 'Deleted');
      } else {
        this.toaster.info('Deletion cancelled.', 'Cancelled');
      }
    });
  }

}
