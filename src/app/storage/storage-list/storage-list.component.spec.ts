import { DebugElement } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ClipboardModule } from 'ngx-clipboard';
import { AlertService } from '../../alert';
import TestComponentWrapper from '../../utils/test-component-wrapper';
import { Folder } from '../model';
import { EditFormFolderService } from '../storage-actions/edit-form-folder';
import { EditFormSecretService } from '../storage-actions/edit-form-secret';

import { StorageListComponent } from './storage-list.component';

describe('StorageListComponent', () => {
  let alertServiceMock;
  let currentFolder;
  let editFormFolderServiceMock;
  let editFormSecretServiceMock;
  let page: Page;

  class Page extends TestComponentWrapper {
    componentInstance: StorageListComponent;

    list: DebugElement;

    initElements() {
      super.initElements();
      this.list = this.getElementByCss('ol');
    }
  }

  beforeEach(async(() => {
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
    currentFolder = new Folder();

    TestBed.configureTestingModule({
      declarations: [
        StorageListComponent,
      ],
      providers: [
        {
          provide: AlertService,
          useValue: alertServiceMock
        },
        {
          provide: EditFormFolderService,
          useValue: editFormFolderServiceMock
        },
        {
          provide: EditFormSecretService,
          useValue: editFormSecretServiceMock
        },
      ],
      imports: [
        ClipboardModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    page = new Page(TestBed.createComponent(StorageListComponent));
    page.fixture.detectChanges();
    page.initElements();
  });

  it('should be created', () => {
    expect(page.componentInstance).toBeTruthy();
  });

  // it('should treat item as secret', () => {
  //   expect(component.asSecret(new Folder())).toBeNull();
  //
  //   const secret = new Secret('Some secret');
  //   expect(component.asSecret(secret)).toEqual(secret);
  //   expect(component.asSecret(secret as Item)).toEqual(secret);
  // });
  //
  // it('should alert when clicked on secret item only', () => {
  //   component.clickItem(new Folder());
  //   expect(alertServiceMock.success).toHaveBeenCalledTimes(0);
  //
  //   const secret = new Secret('Some secret');
  //   component.clickItem(secret);
  //   expect(alertServiceMock.success).toHaveBeenCalledWith(
  //     'Successfully copied to clipboard',
  //     2000
  //   );
  // });
  //
  // it('should open folder when clicked on', () => {
  //   const folder = new Folder();
  //
  //   storageServiceMock.getPathAsString.and.returnValue('/some/path');
  //
  //   component.clickFolder(folder);
  //
  //   expect(storageServiceMock.openFolder).toHaveBeenCalledWith(folder);
  //   expect(routerMock.navigate).toHaveBeenCalledWith(['/storage/some/path']);
  // });
  //
  // it('should edit secret', () => {
  //   const secret = new Secret('Some secret');
  //
  //   component.editSecret(secret);
  //
  //   expect(editFormSecretServiceMock.edit).toHaveBeenCalledWith(secret);
  //   expect(editFormFolderServiceMock.close).toHaveBeenCalled();
  // });
  //
  // it('should edit folder', () => {
  //   const folder = new Folder();
  //
  //   component.editFolder(folder);
  //
  //   expect(editFormFolderServiceMock.edit).toHaveBeenCalledWith(folder);
  //   expect(editFormSecretServiceMock.close).toHaveBeenCalled();
  // });
});
