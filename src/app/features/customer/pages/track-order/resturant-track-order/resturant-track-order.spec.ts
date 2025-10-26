import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResturantTrackOrder } from './resturant-track-order';

describe('ResturantTrackOrder', () => {
  let component: ResturantTrackOrder;
  let fixture: ComponentFixture<ResturantTrackOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResturantTrackOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResturantTrackOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
