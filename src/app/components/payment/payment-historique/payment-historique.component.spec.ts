import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHistoriqueComponent } from './payment-historique.component';

describe('PaymentHistoriqueComponent', () => {
  let component: PaymentHistoriqueComponent;
  let fixture: ComponentFixture<PaymentHistoriqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentHistoriqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentHistoriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
