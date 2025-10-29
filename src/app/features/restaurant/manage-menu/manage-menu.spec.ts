import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMenu } from './manage-menu';

describe('ManageMenu', () => {
  let component: ManageMenu;
  let fixture: ComponentFixture<ManageMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
