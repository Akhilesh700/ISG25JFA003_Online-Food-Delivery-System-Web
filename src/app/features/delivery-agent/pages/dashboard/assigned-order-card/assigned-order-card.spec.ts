import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedOrderCard } from './assigned-order-card';

describe('AssignedOrderCard', () => {
  let component: AssignedOrderCard;
  let fixture: ComponentFixture<AssignedOrderCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedOrderCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedOrderCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
