import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPromo } from './app-promo';

describe('AppPromo', () => {
  let component: AppPromo;
  let fixture: ComponentFixture<AppPromo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppPromo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppPromo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
