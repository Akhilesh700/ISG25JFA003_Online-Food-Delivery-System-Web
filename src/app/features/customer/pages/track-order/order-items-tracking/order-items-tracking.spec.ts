import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderItemsTracking } from './order-items-tracking';

describe('OrderItemsTracking', () => {
  let component: OrderItemsTracking;
  let fixture: ComponentFixture<OrderItemsTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderItemsTracking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderItemsTracking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
