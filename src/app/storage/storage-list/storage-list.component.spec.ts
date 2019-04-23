import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ClipboardModule } from 'ngx-clipboard';
import { AlertService } from '../../alert';
import { Folder, Item, Secret } from '../model';
import { EditFormFolderService } from '../storage-actions/edit-form-folder';
import { EditFormSecretService } from '../storage-actions/edit-form-secret';
import { StorageService } from '../storage.service';

import { StorageListComponent } from './storage-list.component';

describe('StorageListComponent', () => {
  let component: StorageListComponent,
    fixture: ComponentFixture<StorageListComponent>,
    alertServiceMock,
    currentFolder,
    editFormFolderServiceMock,
    editFormSecretServiceMock,
    routerMock,
    storageServiceMock;

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
    routerMock = {
      navigate: jasmine.createSpy()
    };
    currentFolder = new Folder();
    storageServiceMock = {
      isRoot: jasmine.createSpy(),
      getParent: jasmine.createSpy(),
      getCurrent: function () {
        return currentFolder;
      },
      openFolder: jasmine.createSpy(),
      getPathAsString: jasmine.createSpy(),
      getPath: jasmine.createSpy().and.returnValue([])
    };

    TestBed.configureTestingModule({
      declarations: [
        StorageListComponent
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
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: StorageService,
          useValue: storageServiceMock
        }
      ],
      imports: [
        ClipboardModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should treat item as secret', () => {
    expect(component.asSecret(new Folder())).toBeNull();

    const secret = new Secret('Some secret');
    expect(component.asSecret(secret)).toEqual(secret);
    expect(component.asSecret(secret as Item)).toEqual(secret);
  });

  it('should alert when clicked on secret item only', () => {
    component.clickItem(new Folder());
    expect(alertServiceMock.success).toHaveBeenCalledTimes(0);

    const secret = new Secret('Some secret');
    component.clickItem(secret);
    expect(alertServiceMock.success).toHaveBeenCalledWith(
      'Successfully copied to clipboard',
      2000
    );
  });

  it('should open folder when clicked on', () => {
    const folder = new Folder();

    storageServiceMock.getPathAsString.and.returnValue('/some/path');

    component.clickFolder(folder);

    expect(storageServiceMock.openFolder).toHaveBeenCalledWith(folder);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/storage/some/path']);
  });

  it('should edit secret', () => {
    const secret = new Secret('Some secret');

    component.editSecret(secret);

    expect(editFormSecretServiceMock.edit).toHaveBeenCalledWith(secret);
    expect(editFormFolderServiceMock.close).toHaveBeenCalled();
  });

  it('should edit folder', () => {
    const folder = new Folder();

    component.editFolder(folder);

    expect(editFormFolderServiceMock.edit).toHaveBeenCalledWith(folder);
    expect(editFormSecretServiceMock.close).toHaveBeenCalled();
  });
});
