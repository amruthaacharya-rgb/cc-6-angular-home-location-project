import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHomeLocation } from './add-home-location';

describe('AddHomeLocation', () => {
  let component: AddHomeLocation;
  let fixture: ComponentFixture<AddHomeLocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHomeLocation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHomeLocation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
