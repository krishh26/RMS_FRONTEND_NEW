import { TestBed } from '@angular/core/testing';

import { CirSericeService } from './cir-serice.service';

describe('CirSericeService', () => {
  let service: CirSericeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CirSericeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
