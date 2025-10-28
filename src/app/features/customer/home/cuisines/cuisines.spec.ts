import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuisinesComponent } from './cuisines';

describe('CuisinesComponent', () => {
  let component: CuisinesComponent;
  let fixture: ComponentFixture<CuisinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuisinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuisinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
