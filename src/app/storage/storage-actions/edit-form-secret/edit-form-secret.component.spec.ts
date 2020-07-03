import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { PasswordGeneratorService } from '../../../password-generator';

import { Folder, Secret } from '../../model';
import { EditFormSecretComponent } from './edit-form-secret.component';
import { EditFormSecretService } from './edit-form-secret.service';

describe('EditFormSecretComponent', () => {
  const password = 'super-secret!11!';
  let component: EditFormSecretComponent;
  let fixture: ComponentFixture<EditFormSecretComponent>;
  let passwordGeneratorService;
  let editEventSubject;
  let editFormSecretService;

  beforeEach(async(() => {
    editEventSubject = new Subject<Object>();
    editFormSecretService = {
      getEditEvent: jasmine.createSpy().and.returnValue(editEventSubject),
    };
    passwordGeneratorService = {
      generate: jasmine.createSpy().and.returnValue(password),
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
      declarations: [
        EditFormSecretComponent,
      ],
      providers: [
        {
          provide: PasswordGeneratorService,
          useValue: passwordGeneratorService,
        },
        {
          provide: EditFormSecretService,
          useValue: editFormSecretService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFormSecretComponent);
    component = fixture.componentInstance;
    component.current = new Folder('current');
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should generate password', () => {
    expect(component.itemSecret).toEqual(undefined);
    expect(component.itemContent).toEqual(undefined);

    component.generate();

    expect(component.itemSecret).toEqual(password);
  });

  it('should create a secret', () => {
    expect(component.itemSecret).toEqual(undefined);
    expect(component.itemContent).toEqual(undefined);

    editEventSubject.next();

    expect(component.isEditMode()).toBeFalsy();
    expect(component.detailsShown).toBeFalsy();
    expect(component.itemSecret).toEqual(password);
    expect(component.itemContent).toEqual('');
  });

  it('should open a secret', () => {
    expect(component.itemSecret).toEqual(undefined);
    expect(component.itemContent).toEqual(undefined);

    const secret = new Secret('test');
    editEventSubject.next(secret);

    expect(component.isEditMode()).toBeTruthy();
    expect(component.detailsShown).toBeTruthy();
    expect(component.itemSecret).toEqual('');
    expect(component.itemContent).toEqual('');
  });

  it('should save in edit mode', () => {
    expect(component.isEditMode()).toBeFalsy();
    expect(component.isActive).toBeFalsy();

    editEventSubject.next(new Secret('test'));

    expect(component.isEditMode()).toBeTruthy();
    expect(component.isActive).toBeTruthy();

    component.itemName = 'hello virtual world!';
    component.submit();

    expect(component.itemSource.getName()).toEqual('hello virtual world!');
    expect(component.isActive).toBeFalsy();
  });

  it('should add in create mode', () => {
    expect(component.isEditMode()).toBeFalsy();
    expect(component.isActive).toBeFalsy();

    editEventSubject.next();

    expect(component.isEditMode()).toBeFalsy();
    expect(component.isActive).toBeTruthy();

    component.itemName = 'hello virtual world!';
    component.submit();

    expect(component.itemSource).toBeUndefined();
    expect(component.current.getItems().length).toEqual(1);
    expect(component.isActive).toBeFalsy();
  });
});
