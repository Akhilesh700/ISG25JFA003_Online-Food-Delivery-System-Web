/* tslint:disable:no-unused-variable */
import {  ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UnauthorisedComponent } from './unauthorised.component';

describe('UnauthorisedComponent', () => {
  let component: UnauthorisedComponent;
  let fixture: ComponentFixture<UnauthorisedComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnauthorisedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthorisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
