import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSucessDialog } from './payment-sucess-dialog';

describe('PaymentSucessDialog', () => {
  let component: PaymentSucessDialog;
  let fixture: ComponentFixture<PaymentSucessDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSucessDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentSucessDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
