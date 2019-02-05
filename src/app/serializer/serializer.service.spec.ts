import { TestBed, inject } from '@angular/core/testing';
import { SerializableClass } from './serializable';

import { SerializerService } from './serializer.service';

class WrongClass extends SerializableClass {}

describe('SerializerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SerializerService],
    });
  });

  it('should be created', inject([SerializerService], (service: SerializerService) => {
    expect(service).toBeTruthy();
  }));

  it('should fail if item is not properly defined', () => {
    const wrongClass = new WrongClass();
    const expectedError = new Error('getClassName() should be specified');
    expect(() => wrongClass.getClassName()).toThrow(expectedError);
  });
});
