import { DebugElement } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import TestComponentWrapper from '../../../utils/test-component-wrapper';
import { EditFormFolderComponent } from './edit-form-folder.component';
import { EditFormFolderService } from './edit-form-folder.service';

describe('EditFormFolderComponent', () => {
  let editEventSubject;
  let editFormFolderService;
  let page: Page;

  class Page extends TestComponentWrapper {
    componentInstance: EditFormFolderComponent;

    list: DebugElement;

    initElements() {
      super.initElements();
      this.list = this.getElementByCss('ol');
    }
  }

  beforeEach(async(() => {
    editEventSubject = new Subject<Object>();
    editFormFolderService = {
      getEditEvent: jasmine.createSpy().and.returnValue(editEventSubject)
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        EditFormFolderComponent,
      ],
      providers: [
        {
          provide: EditFormFolderService,
          useValue: editFormFolderService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    page = new Page(TestBed.createComponent(EditFormFolderComponent));
    page.fixture.detectChanges();
    page.initElements();
  });

  it('should be created', () => {
    expect(page.componentInstance).toBeTruthy();
  });
});
