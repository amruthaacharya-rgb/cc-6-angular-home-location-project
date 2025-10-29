import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingLocationDetails } from './housing-location-details';

describe('HousingLocationDetails', () => {
  let component: HousingLocationDetails;
  let fixture: ComponentFixture<HousingLocationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingLocationDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HousingLocationDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
