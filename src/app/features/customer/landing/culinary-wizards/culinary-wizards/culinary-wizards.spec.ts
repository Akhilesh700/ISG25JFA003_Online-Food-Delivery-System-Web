import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CulinaryWizardsComponent } from './culinary-wizards';

describe('CulinaryWizardsComponent', () => {
  let component: CulinaryWizardsComponent;
  let fixture: ComponentFixture<CulinaryWizardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CulinaryWizardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CulinaryWizardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
