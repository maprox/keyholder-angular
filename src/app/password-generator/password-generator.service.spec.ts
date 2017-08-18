import { TestBed, inject } from '@angular/core/testing';

import { PasswordGeneratorService } from './password-generator.service';

describe('PasswordGeneratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordGeneratorService]
    });
  });

  it('should be created', inject([PasswordGeneratorService], (service: PasswordGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
