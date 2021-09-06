import { FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';

import { StorageService } from '../storage.service';
import { SearchComponent } from './search.component';

import TestComponentWrapper from '../../utils/test-component-wrapper';

describe('SearchComponent', () => {
  let routerMock;
  let storageServiceMock;
  let page: Page;

  class Page extends TestComponentWrapper {
    componentInstance: SearchComponent;

    searchInput: DebugElement;

    detectChanges() {
      super.detectChanges();
      this.searchInput = this.getElementByCss('input[type=search]');
    }
  }

  beforeEach(waitForAsync(() => {
    storageServiceMock = {
      search: jasmine.createSpy(),
    };
    routerMock = {};
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
      declarations: [
        SearchComponent,
      ],
      providers: [
        {
          provide: StorageService,
          useValue: storageServiceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    page = new Page(TestBed.createComponent(SearchComponent));
    page.detectChanges();
  });

  it('should be created', () => {
    expect(page.componentInstance).toBeTruthy();
  });

  it('should initiate search', (done) => {
    page.whenStable(() => {
      const el = page.searchInput.nativeElement;
      expect(el.value).toBe('');

      const newValue = 'someValue';
      el.value = newValue;
      el.dispatchEvent(new Event('input'));

      expect(storageServiceMock.search).toHaveBeenCalledTimes(1);
      expect(storageServiceMock.search).toHaveBeenCalledWith(newValue);
      done();
    });
  });
});
