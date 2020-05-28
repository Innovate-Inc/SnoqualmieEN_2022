import { TestBed } from '@angular/core/testing';

import { IdentityManagementService } from './identity-management.service';

describe('IdentityManagementService', () => {
  let service: IdentityManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdentityManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
