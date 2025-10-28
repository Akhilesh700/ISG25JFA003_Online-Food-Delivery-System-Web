/* tslint:disable:no-unused-variable */
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RestaurantFormComponent } from './restaurant-form.component';

describe('RestaurantFormComponent', () => {
  let component: RestaurantFormComponent;
  let fixture: ComponentFixture<RestaurantFormComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RestaurantFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
