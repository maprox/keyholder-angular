import { TestBed } from '@angular/core/testing';

import { StorageSearcherService } from './storage-searcher.service';

describe('StorageSearcherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StorageSearcherService = TestBed.get(StorageSearcherService);
    expect(service).toBeTruthy();
  });
});
