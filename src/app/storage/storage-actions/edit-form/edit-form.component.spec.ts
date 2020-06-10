import { Component, OnInit } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { EditFormComponentDirective } from './edit-form-component.directive';
import { EditFormService } from './edit-form.service';
import { Folder, Secret } from '../../model';
import { StorageService } from '../../storage.service';

@Component({
  template: '<input name="fieldName" #fieldName>'
})
class EditFormTestComponent extends EditFormComponentDirective implements OnInit {
  constructor(
    protected storage: StorageService,
    protected editFormService: EditFormService
  ) {
    super(storage, editFormService);
  }
}

describe('EditFormComponent', () => {
  let component: EditFormTestComponent,
    fixture: ComponentFixture<EditFormTestComponent>,
    storageCurrent: Folder,
    storageServiceMock,
    editEventSubject,
    editFormServiceMock;

  beforeEach(async(() => {
    storageCurrent = new Folder('current');
    storageServiceMock = {
      getCurrent: jasmine.createSpy().and.returnValue(storageCurrent),
      save: jasmine.createSpy()
    };
    editEventSubject = new Subject<Object>();
    editFormServiceMock = {
      getEditEvent: jasmine.createSpy().and.returnValue(editEventSubject)
    };

    TestBed.configureTestingModule({
      declarations: [
        EditFormTestComponent
      ],
      providers: [
        {
          provide: StorageService,
          useValue: storageServiceMock
        },
        {
          provide: EditFormService,
          useValue: editFormServiceMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFormTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should listen for edit event', () => {
    expect(component.isEditMode()).toBeFalsy();
    expect(component.isActive).toBeFalsy();

    editEventSubject.next(new Secret('test'));

    expect(component.isEditMode()).toBeTruthy();
    expect(component.isActive).toBeTruthy();

    editEventSubject.next(null);

    expect(component.isEditMode()).toBeTruthy();
    expect(component.isActive).toBeFalsy();
  });

  it('should check edit mode', () => {
    expect(component.isEditMode()).toBeFalsy();
    component.open(new Secret('example'));
    expect(component.isEditMode()).toBeTruthy();
  });

  it('should focus input field when opened', fakeAsync(() => {
    expect(component.isEditMode()).toBeFalsy();
    component.open(null as Secret);
    expect(component.isEditMode()).toBeFalsy();

    const compiled = fixture.debugElement.nativeElement.querySelector('input');
    spyOn(compiled, 'focus');


    tick();

    fixture.detectChanges();
    expect(compiled.focus).toHaveBeenCalled();
    expect(component.isActive).toBeTruthy();
  }));

  it('should change active status when closed or submitted', () => {
    component.open(null as Secret);
    expect(component.isActive).toBeTruthy();

    component.close();
    expect(component.isActive).toBeFalsy();

    component.open(new Secret('test'));
    expect(component.isActive).toBeTruthy();

    component.submit();
    expect(component.isActive).toBeFalsy();
  });

  it('should add item', () => {
    expect(storageCurrent.toJSON().items.length).toEqual(0);

    component.add(new Secret('test'));

    expect(storageServiceMock.getCurrent).toHaveBeenCalled();
    expect(storageServiceMock.save).toHaveBeenCalled();
    expect(storageCurrent.toJSON().items.length).toEqual(1);
  });

  it('should remove item', () => {
    const secret = storageCurrent.add(new Secret('test'));
    expect(storageCurrent.toJSON().items.length).toEqual(1);

    component.remove(secret);

    expect(storageServiceMock.getCurrent).toHaveBeenCalled();
    expect(storageServiceMock.save).toHaveBeenCalled();
    expect(storageCurrent.toJSON().items.length).toEqual(0);
  });

  it('should save item', () => {
    const secret = new Secret('test');
    expect(secret.getName()).toEqual('test');

    component.itemName = 'something new';
    component.save(secret);

    expect(secret.getName()).toEqual('something new');
    expect(storageServiceMock.save).toHaveBeenCalled();
  });
});
