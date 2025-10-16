/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SignupServiceService } from '../signup-service.service';

describe('Service: SignupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignupServiceService]
    });
  });

  it('should ...', inject([SignupServiceService], (service: SignupServiceService) => {
    expect(service).toBeTruthy();
  }));
});
