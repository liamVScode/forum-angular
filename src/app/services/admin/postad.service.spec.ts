import { TestBed } from '@angular/core/testing';

import { PostadService } from './postad.service';

describe('PostadService', () => {
  let service: PostadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
