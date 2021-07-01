// import { Component } from '@angular/core';
// import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
// import { Subject } from 'rxjs';
// import { Folder, Secret } from '../../model';
//
// import { EditFormComponentDirective } from './edit-form-component.directive';
// import { EditFormService } from './edit-form.service';
//
// @Component({
//   template: '<input name="fieldName" #fieldName>',
// })
// class EditFormTestComponent extends EditFormComponentDirective {}
//
// describe('EditFormComponent', () => {
//   let component: EditFormTestComponent;
//   let fixture: ComponentFixture<EditFormTestComponent>;
//   let editEventSubject;
//   let editFormServiceMock;
//   let onItemAdd;
//   let onItemRemove;
//   let onItemChange;
//
//   beforeEach(async(() => {
//     editEventSubject = new Subject<Object>();
//     editFormServiceMock = {
//       getEditEvent: jasmine.createSpy().and.returnValue(editEventSubject),
//     };
//
//     TestBed.configureTestingModule({
//       declarations: [
//         EditFormTestComponent,
//       ],
//       providers: [
//         {
//           provide: EditFormService,
//           useValue: editFormServiceMock,
//         },
//       ],
//     }).compileComponents();
//   }));
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(EditFormTestComponent);
//     component = fixture.componentInstance;
//     component.current = new Folder('current');
//
//     onItemAdd = jasmine.createSpy();
//     onItemRemove = jasmine.createSpy();
//     onItemChange = jasmine.createSpy();
//
//     component.itemAdd.subscribe(onItemAdd);
//     component.itemRemove.subscribe(onItemRemove);
//     component.itemChange.subscribe(onItemChange);
//
//     fixture.detectChanges();
//   });
//
//   it('should be created', () => {
//     expect(component).toBeTruthy();
//   });
//
//   it('should listen for edit event', () => {
//     expect(component.isEditMode()).toBeFalsy();
//     expect(component.isActive).toBeFalsy();
//
//     editEventSubject.next(new Secret('test'));
//
//     expect(component.isEditMode()).toBeTruthy();
//     expect(component.isActive).toBeTruthy();
//
//     editEventSubject.next(null);
//
//     expect(component.isEditMode()).toBeTruthy();
//     expect(component.isActive).toBeFalsy();
//   });
//
//   it('should check edit mode', () => {
//     expect(component.isEditMode()).toBeFalsy();
//     component.open(new Secret('example'));
//     expect(component.isEditMode()).toBeTruthy();
//   });
//
//   it('should focus input field when opened', fakeAsync(() => {
//     expect(component.isEditMode()).toBeFalsy();
//     component.open(null as Secret);
//     expect(component.isEditMode()).toBeFalsy();
//
//     const compiled = fixture.debugElement.nativeElement.querySelector('input');
//     spyOn(compiled, 'focus');
//
//     tick();
//
//     fixture.detectChanges();
//     expect(compiled.focus).toHaveBeenCalled();
//     expect(component.isActive).toBeTruthy();
//   }));
//
//   it('should change active status when closed or submitted', () => {
//     component.open(null as Secret);
//     expect(component.isActive).toBeTruthy();
//
//     component.close();
//     expect(component.isActive).toBeFalsy();
//
//     component.open(new Secret('test'));
//     expect(component.isActive).toBeTruthy();
//
//     component.submit();
//     expect(component.isActive).toBeFalsy();
//   });
//
//   it('should add item', () => {
//     expect(component.current.toJSON().items.length).toEqual(0);
//
//     const item = new Secret('test');
//     component.add(item);
//
//     expect(component.current.toJSON().items.length).toEqual(1);
//     expect(onItemAdd).toHaveBeenCalledWith(item);
//   });
//
//   it('should remove item', () => {
//     const secret = component.current.add(new Secret('test'));
//     expect(component.current.toJSON().items.length).toEqual(1);
//
//     component.remove(secret);
//
//     expect(component.current.toJSON().items.length).toEqual(0);
//     expect(onItemRemove).toHaveBeenCalledWith(secret);
//   });
//
//   it('should save item', () => {
//     const secret = new Secret('test');
//     expect(secret.getName()).toEqual('test');
//
//     component.itemName = 'something new';
//     component.change(secret);
//
//     expect(secret.getName()).toEqual('something new');
//     expect(onItemChange).toHaveBeenCalledWith(secret);
//   });
// });
