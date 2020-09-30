import { TestBed } from '@angular/core/testing';

import { DocuService } from './docu.service';

describe('DocuService', () => {
  let service: DocuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
