import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CulinaryWizards } from './culinary-wizards';

describe('CulinaryWizards', () => {
  let component: CulinaryWizards;
  let fixture: ComponentFixture<CulinaryWizards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CulinaryWizards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CulinaryWizards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
