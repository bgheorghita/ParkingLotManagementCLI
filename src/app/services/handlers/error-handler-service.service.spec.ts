import { TestBed } from '@angular/core/testing';

import { ErrorHandlerService } from './error-handler-service.service';

describe('ErrorHandlerServiceService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
