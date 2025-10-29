import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemDialog } from './menu-item-dialog';

describe('MenuItemDialog', () => {
  let component: MenuItemDialog;
  let fixture: ComponentFixture<MenuItemDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
