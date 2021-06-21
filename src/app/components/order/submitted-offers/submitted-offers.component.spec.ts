import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedOffersComponent } from './submitted-offers.component';

describe('SubmittedOffersComponent', () => {
  let component: SubmittedOffersComponent;
  let fixture: ComponentFixture<SubmittedOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmittedOffersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
