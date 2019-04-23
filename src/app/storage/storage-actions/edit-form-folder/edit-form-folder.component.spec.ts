import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { Folder } from '../../model';
import { StorageService } from '../../storage.service';
import { EditFormFolderComponent } from './edit-form-folder.component';
import { EditFormFolderService } from './edit-form-folder.service';

describe('EditFormFolderComponent', () => {
  let component: EditFormFolderComponent,
    fixture: ComponentFixture<EditFormFolderComponent>,
    routerMock,
    storageCurrent: Folder,
    storageServiceMock,
    editEventSubject,
    editFormFolderService;

  beforeEach(async(() => {
    routerMock = {
      navigate: jasmine.createSpy()
    };
    storageCurrent = new Folder('current');
    storageServiceMock = {
      getCurrent: jasmine.createSpy().and.returnValue(storageCurrent),
      getPathAsString: () => '/some/path',
      openFolder: jasmine.createSpy(),
      save: jasmine.createSpy()
    };
    editEventSubject = new Subject<Object>();
    editFormFolderService = {
      getEditEvent: jasmine.createSpy().and.returnValue(editEventSubject)
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        EditFormFolderComponent
      ],
      providers: [
        {
          provide: StorageService,
          useValue: storageServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: EditFormFolderService,
          useValue: editFormFolderService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFormFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should save in edit mode', () => {
    expect(component.isEditMode()).toBeFalsy();
    expect(component.isActive).toBeFalsy();

    editEventSubject.next(new Folder('test'));

    expect(component.isEditMode()).toBeTruthy();
    expect(component.isActive).toBeTruthy();

    component.itemName = 'hello virtual world!';
    component.submit();

    expect(component.itemSource.getName()).toEqual('hello virtual world!');
    expect(storageServiceMock.save).toHaveBeenCalled();
    expect(component.isActive).toBeFalsy();
  });

  it('should add in create mode', () => {
    expect(component.isEditMode()).toBeFalsy();
    expect(component.isActive).toBeFalsy();

    editEventSubject.next();

    expect(component.isEditMode()).toBeFalsy();
    expect(component.isActive).toBeTruthy();

    const msg = 'hello virtual world!';
    component.itemName = msg;
    component.submit();

    expect(component.itemSource).toBeUndefined();
    expect(storageServiceMock.getCurrent).toHaveBeenCalled();
    expect(storageServiceMock.save).toHaveBeenCalled();
    expect(storageServiceMock.openFolder).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/storage/some/path']);
    expect(storageCurrent.getFolderByName(msg)).toEqual(new Folder(msg));
    expect(component.isActive).toBeFalsy();
  });
});
