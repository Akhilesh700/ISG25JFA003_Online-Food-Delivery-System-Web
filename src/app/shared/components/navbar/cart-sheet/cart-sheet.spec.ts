import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartSheet } from './cart-sheet';

describe('CartSheet', () => {
  let component: CartSheet;
  let fixture: ComponentFixture<CartSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartSheet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
