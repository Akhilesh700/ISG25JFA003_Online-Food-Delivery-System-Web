import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotSellingRecipes } from './hot-selling-recipes';

describe('HotSellingRecipes', () => {
  let component: HotSellingRecipes;
  let fixture: ComponentFixture<HotSellingRecipes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotSellingRecipes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotSellingRecipes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
