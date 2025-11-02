import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWrapper } from './card-wrapper';

describe('CardWrapper', () => {
  let component: CardWrapper;
  let fixture: ComponentFixture<CardWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
