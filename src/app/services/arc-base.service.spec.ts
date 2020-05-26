import { TestBed } from '@angular/core/testing';

import { ArcBaseService } from './arc-base.service';

describe('ArcBaseService', () => {
  let service: ArcBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArcBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
