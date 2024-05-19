import { TestBed } from '@angular/core/testing';

import { ForuminfoService } from './foruminfo.service';

describe('ForuminfoService', () => {
  let service: ForuminfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForuminfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
