// import { Component } from '@angular/core';
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import { Subject } from 'rxjs';
//
// import { Folder } from '../../model';
// import { EditFormFolderComponent } from './edit-form-folder.component';
// import { EditFormFolderService } from './edit-form-folder.service';
//
// describe('EditFormFolderComponent', () => {
//   let component: TestComponent;
//   let fixture: ComponentFixture<TestComponent>;
//   let editEventSubject;
//   let editFormFolderService;
//
//   beforeEach(async(() => {
//     editEventSubject = new Subject<Object>();
//     editFormFolderService = {
//       getEditEvent: jasmine.createSpy().and.returnValue(editEventSubject)
//     };
//
//     TestBed.configureTestingModule({
//       imports: [
//         FormsModule
//       ],
//       declarations: [
//         EditFormFolderComponent,
//         TestComponent,
//       ],
//       providers: [
//         {
//           provide: EditFormFolderService,
//           useValue: editFormFolderService
//         }
//       ]
//     }).compileComponents();
//   }));
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(TestComponent);
//     component = fixture.componentInstance;
//     // component.current = new Folder('current');
//     fixture.detectChanges();
//   });
//
//   it('should be created', () => {
//     expect(component).toBeTruthy();
//   });
//
//   it('should save in edit mode', () => {
//     expect(component.isEditMode()).toBeFalsy();
//     expect(component.isActive).toBeFalsy();
//
//     editEventSubject.next(new Folder('test'));
//
//     expect(component.isEditMode()).toBeTruthy();
//     expect(component.isActive).toBeTruthy();
//
//     component.itemName = 'hello virtual world!';
//     component.submit();
//
//     expect(component.itemSource.getName()).toEqual('hello virtual world!');
//     expect(component.isActive).toBeFalsy();
//   });
//
//   it('should add in create mode', () => {
//     expect(component.isEditMode()).toBeFalsy();
//     expect(component.isActive).toBeFalsy();
//
//     editEventSubject.next();
//
//     expect(component.isEditMode()).toBeFalsy();
//     expect(component.isActive).toBeTruthy();
//
//     const msg = 'hello virtual world!';
//     component.itemName = msg;
//     component.submit();
//
//     expect(component.itemSource).toBeUndefined();
//     expect(component.current.getFolderByName(msg)).toEqual(new Folder(msg));
//     expect(component.isActive).toBeFalsy();
//   });
// });
//
// @Component({
//   selector: 'app-test-component',
//   template: `<app-edit-form-folder></app-edit-form-folder>`
// })
// class TestComponent {
//   // tbd
// }
