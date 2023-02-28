import { TestBed } from '@angular/core/testing';

import { XsltService } from './xslt.service';

describe('XsltService', () => {
  let service: XsltService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XsltService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
