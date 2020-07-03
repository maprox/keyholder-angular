import { inject, TestBed } from '@angular/core/testing';
import { Secret } from '../../model';

import { EditFormService } from './edit-form.service';

describe('EditFormService', () => {
  let service: EditFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EditFormService,
      ],
    });
  });

  beforeEach(inject([EditFormService], (editFormService: EditFormService) => {
    service = editFormService;
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should edit item', () => {
    let expectedItem = null;
    service.getEditEvent().subscribe((item) => {
      expectedItem = item;
    });

    expect(expectedItem).toBeNull();

    const secret = new Secret('hello');
    service.edit(secret);

    expect(expectedItem).toEqual(secret);
  });

  it('should create item', () => {
    let expectedItem = null;
    service.getEditEvent().subscribe((item) => {
      expectedItem = item;
    });

    expect(expectedItem).toBeNull();

    service.create();

    expect(expectedItem).toEqual(undefined);
  });

  it('should close edit form', () => {
    let expectedItem = 'test';
    service.getEditEvent().subscribe((item) => {
      expectedItem = item;
    });

    expect(expectedItem).toEqual('test');

    service.close();

    expect(expectedItem).toBeNull();
  });
});
