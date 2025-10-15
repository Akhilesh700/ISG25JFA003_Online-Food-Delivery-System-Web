import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantCheckoutCart } from './restaurant-checkout-cart';

describe('RestaurantCheckoutCart', () => {
  let component: RestaurantCheckoutCart;
  let fixture: ComponentFixture<RestaurantCheckoutCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantCheckoutCart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantCheckoutCart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
