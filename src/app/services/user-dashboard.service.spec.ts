import { TestBed } from '@angular/core/testing';

import { UserDashboardService } from './user-dashboard.service';

describe('UserProfileService', () => {
  let service: UserDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
