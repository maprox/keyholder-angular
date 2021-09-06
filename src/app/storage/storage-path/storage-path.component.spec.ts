import { DebugElement } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import TestComponentWrapper from '../../utils/test-component-wrapper';

import { getSophisticatedRoot } from '../../utils/test-folder-mocks';
import { Folder } from '../model';
import { StoragePathComponent } from './storage-path.component';

describe('SearchPathComponent', () => {
  let page: Page;

  class Page extends TestComponentWrapper {
    componentInstance: StoragePathComponent;

    list: DebugElement;
    items: DebugElement[];

    detectChanges() {
      super.detectChanges();
      this.list = this.getElementByCss('ol');
      this.items = this.getElementsByCss('li');
    }
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        StoragePathComponent,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    page = new Page(TestBed.createComponent(StoragePathComponent));
    page.detectChanges();
  });

  it('should be created', () => {
    expect(page.componentInstance).toBeTruthy();
  });

  it('should have empty list', ((done) => {
    page.componentInstance.ngOnChanges(null);
    page.whenStable(() => {
      page.detectChanges();
      expect(page.items.length).toBe(0);
      done();
    });
  }));

  it('should have breadcrumbs', ((done) => {
    const root = getSophisticatedRoot();
    page.componentInstance.root = root;
    page.componentInstance.current = root
      .getFolderByName('alpha')
      .getFolderByName('alpha-sub-folder1');
    page.componentInstance.ngOnChanges(null);
    page.whenStable(() => {
      page.detectChanges();
      expect(page.items.length).toBe(3);
      expect(page.items.map((el) => el.nativeElement.textContent.trim())).toEqual([
        '/',
        'alpha',
        'alpha-sub-folder1',
      ]);

      // let's also click the second item and check that we emit a "folder-clicked" event
      let selectedFolder: Folder;
      page.componentInstance.folderClicked.subscribe((folder) => {
        selectedFolder = folder;
      });
      page.items[1].query(By.css('a')).nativeElement.click();
      page.detectChanges();
      expect(selectedFolder).toBeInstanceOf(Folder);
      expect(selectedFolder.getName()).toBe('alpha');

      done();
    });
  }));
});
