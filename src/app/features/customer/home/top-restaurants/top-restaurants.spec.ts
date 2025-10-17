import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRestaurants } from './top-restaurants';

describe('TopRestaurants', () => {
  let component: TopRestaurants;
  let fixture: ComponentFixture<TopRestaurants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopRestaurants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRestaurants);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
