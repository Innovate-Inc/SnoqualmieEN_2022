import { TestBed } from '@angular/core/testing';

import { MapToListService } from './map-to-list.service';

describe('MapToListService', () => {
  let service: MapToListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapToListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
