import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentConfirmed } from './payment-confirmed';

describe('PaymentConfirmed', () => {
  let component: PaymentConfirmed;
  let fixture: ComponentFixture<PaymentConfirmed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentConfirmed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentConfirmed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
