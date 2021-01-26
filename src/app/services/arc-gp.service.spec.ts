import { TestBed } from '@angular/core/testing';

import { ArcGpService } from './arc-gp.service';

describe('ArcGpService', () => {
  let service: ArcGpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArcGpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
