import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRestaurantsComponent } from './top-restaurants';

describe('TopRestaurantsComponent', () => {
  let component: TopRestaurantsComponent;
  let fixture: ComponentFixture<TopRestaurantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopRestaurantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRestaurantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
