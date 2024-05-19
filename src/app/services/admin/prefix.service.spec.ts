import { TestBed } from '@angular/core/testing';

import { PrefixService } from './prefix.service';

describe('PrefixService', () => {
  let service: PrefixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrefixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
