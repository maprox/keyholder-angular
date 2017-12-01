import { TestBed, inject } from '@angular/core/testing';

import { EncryptingService } from './encrypting.service';

describe('EncryptingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EncryptingService]
    });
  });

  it('should be created', inject([EncryptingService], (service: EncryptingService) => {
    expect(service).toBeTruthy();
  }));
});
