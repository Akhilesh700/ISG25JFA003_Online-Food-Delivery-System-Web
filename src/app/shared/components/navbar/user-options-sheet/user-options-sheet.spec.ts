import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOptionsSheet } from './user-options-sheet';

describe('UserOptionsSheet', () => {
  let component: UserOptionsSheet;
  let fixture: ComponentFixture<UserOptionsSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOptionsSheet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOptionsSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
