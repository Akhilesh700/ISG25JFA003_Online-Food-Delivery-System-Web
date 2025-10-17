import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularDishes } from './popular-dishes';

describe('PopularDishes', () => {
  let component: PopularDishes;
  let fixture: ComponentFixture<PopularDishes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularDishes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularDishes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
