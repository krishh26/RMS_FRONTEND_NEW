import { TestBed } from '@angular/core/testing';

import { AcrServiceService } from './acr-service.service';

describe('AcrServiceService', () => {
  let service: AcrServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcrServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
