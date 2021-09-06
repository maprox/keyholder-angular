import { DebugElement } from '@angular/core';
import { fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClipboardModule } from 'ngx-clipboard';
import { AlertService } from '../../alert';
import TestComponentWrapper from '../../utils/test-component-wrapper';
import { getSophisticatedRoot } from '../../utils/test-folder-mocks';
import { Folder, Secret } from '../model';
import { EditFormFolderService } from '../storage-actions/edit-form-folder';
import { EditFormSecretService } from '../storage-actions/edit-form-secret';

import { StorageListComponent } from './storage-list.component';

describe('StorageListComponent', () => {
  let alertServiceMock;
  let editFormFolderServiceMock;
  let editFormSecretServiceMock;
  let page: Page;
  let root: Folder;
  let parent: Folder;
  let current: Folder;

  class Page extends TestComponentWrapper {
    componentInstance: StorageListComponent;

    list: DebugElement;
    parent: DebugElement;
    items: DebugElement[];

    detectChanges() {
      super.detectChanges();
      this.list = this.getElementByCss('[data-cy=list]');
      this.parent = this.getElementByCss('[data-cy=parent]');
      this.items = this.getElementsByCss('[data-cy=item]');
    }

    clickParent() {
      this.parent.nativeElement.click();
      this.detectChanges();
    }

    clickItem(index: any) {
      this.items[index].nativeElement.click();
      this.detectChanges();
    }

    getItemBySelector(index: any, selector: string) {
      return this.items[index].query(By.css(`[data-cy=${selector}]`));
    }
  }

  beforeEach(waitForAsync(() => {
    alertServiceMock = {
      success: jasmine.createSpy()
    };
    editFormFolderServiceMock = {
      edit: jasmine.createSpy(),
      close: jasmine.createSpy()
    };
    editFormSecretServiceMock = {
      edit: jasmine.createSpy(),
      close: jasmine.createSpy()
    };

    TestBed.configureTestingModule({
      declarations: [
        StorageListComponent,
      ],
      providers: [
        {
          provide: AlertService,
          useValue: alertServiceMock,
        },
        {
          provide: EditFormFolderService,
          useValue: editFormFolderServiceMock,
        },
        {
          provide: EditFormSecretService,
          useValue: editFormSecretServiceMock,
        },
      ],
      imports: [
        ClipboardModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    page = new Page(TestBed.createComponent(StorageListComponent));
    page.detectChanges();
  });

  function setCurrentFolder() {
    root = getSophisticatedRoot();
    parent = root.getFolderByName('alpha');
    current = parent.getFolderByName('alpha-sub-folder1');
    page.componentInstance.parent = parent;
    page.componentInstance.current = current;
    page.detectChanges();
  }

  it('should be created', () => {
    expect(page.componentInstance).toBeTruthy();
  });

  it('should display current folder items', fakeAsync(() => {
    // initially it is empty, since there is no "current" folder specified
    expect(page.list.nativeElement.innerText).toEqual('This folder is empty');
    expect(page.parent).toBeFalsy();
    expect(page.items.length).toEqual(0);

    setCurrentFolder();

    expect(page.parent).toBeTruthy();
    expect(page.items.length).toEqual(3);
  }));

  it('should copy secret to clipboard', fakeAsync(() => {
    expect(alertServiceMock.success).toHaveBeenCalledTimes(0);
    expect(page.componentInstance.asSecret(new Folder())).toBeNull(); // \_(o_O)_/ :D

    setCurrentFolder();

    expect(page.getItemBySelector(2, 'secret-name').nativeElement.innerText).toEqual('asf-1');
    expect(page.getItemBySelector(2, 'secret-content').nativeElement.innerText).toEqual('test note');
    page.clickItem(2);

    expect(alertServiceMock.success).toHaveBeenCalledWith(
      'Successfully copied to clipboard',
      2000
    );
  }));

  it('should click an inner folder', fakeAsync(() => {
    let clickedFolder: Folder;
    page.componentInstance.folderClicked.subscribe((folder) => { clickedFolder = folder });

    setCurrentFolder();

    page.clickItem(0);

    expect(clickedFolder).toEqual(current.getFolderByName('alpha-sub-folder1-sub-folder1'));
  }));

  it('should click a parent folder', fakeAsync(() => {
    let clickedFolder: Folder;
    page.componentInstance.folderClicked.subscribe((folder) => { clickedFolder = folder });

    setCurrentFolder();

    page.clickParent();

    expect(clickedFolder).toEqual(parent);
  }));

  it('should edit secret', () => {
    const secret = new Secret('Some secret');

    page.componentInstance.editSecret(secret);

    expect(editFormSecretServiceMock.edit).toHaveBeenCalledWith(secret);
    expect(editFormFolderServiceMock.close).toHaveBeenCalled();
  });

  it('should edit folder', () => {
    const folder = new Folder();

    page.componentInstance.editFolder(folder);

    expect(editFormFolderServiceMock.edit).toHaveBeenCalledWith(folder);
    expect(editFormSecretServiceMock.close).toHaveBeenCalled();
  });
});
