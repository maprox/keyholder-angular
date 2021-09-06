import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import TestComponentWrapper from '../../utils/test-component-wrapper';
import { Folder, Item } from '../model';
import { EditFormFolderService } from './edit-form-folder';
import { EditFormSecretService } from './edit-form-secret';

import { StorageActionsComponent } from './storage-actions.component';

@Component({
  selector: 'app-edit-form-secret',
  template: '<div>Fake edit form secret component</div>'
})
class FakeEditFormSecretComponent {
  @Input() current: Folder;

  @Output() itemAdd = new EventEmitter<Item>();
  @Output() itemRemove = new EventEmitter<Item>();
  @Output() itemChange = new EventEmitter<Item>();
}

@Component({
  selector: 'app-edit-form-folder',
  template: '<div>Fake edit form folder component</div>'
})
class FakeEditFormFolderComponent {
  @Input() current: Folder;

  @Output() itemAdd = new EventEmitter<Item>();
  @Output() itemRemove = new EventEmitter<Item>();
  @Output() itemChange = new EventEmitter<Item>();
}

describe('StorageActionsComponent', () => {
  let editFormSecretServiceMock;
  let editFormFolderServiceMock;
  let page: Page;

  class Page extends TestComponentWrapper {
    componentInstance: StorageActionsComponent;

    buttonAddSecret: DebugElement;
    buttonAddFolder: DebugElement;

    detectChanges() {
      super.detectChanges();
      this.buttonAddSecret = this.getElementByCss('button[data-cy=add-secret]');
      this.buttonAddFolder = this.getElementByCss('button[data-cy=add-folder]');
    }
  }

  beforeEach(waitForAsync(() => {
    editFormSecretServiceMock = {
      create: jasmine.createSpy(),
      close: jasmine.createSpy()
    };
    editFormFolderServiceMock = {
      create: jasmine.createSpy(),
      close: jasmine.createSpy()
    };

    TestBed.configureTestingModule({
      declarations: [
        StorageActionsComponent,
        FakeEditFormSecretComponent,
        FakeEditFormFolderComponent
      ],
      providers: [
        {
          provide: EditFormSecretService,
          useValue: editFormSecretServiceMock
        },
        {
          provide: EditFormFolderService,
          useValue: editFormFolderServiceMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    page = new Page(TestBed.createComponent(StorageActionsComponent));
    page.detectChanges();
  });

  it('should be created', () => {
    expect(page.componentInstance).toBeTruthy();
  });

  it('should show add folder panel', (done) => {
    page.whenStable(() => {
      page.buttonAddFolder.nativeElement.click();
      expect(editFormFolderServiceMock.create).toHaveBeenCalled();
      expect(editFormSecretServiceMock.close).toHaveBeenCalled();
      done();
    });
  });

  it('should show add secret panel', (done) => {
    page.whenStable(() => {
      page.buttonAddSecret.nativeElement.click();
      expect(editFormSecretServiceMock.create).toHaveBeenCalled();
      expect(editFormFolderServiceMock.close).toHaveBeenCalled();
      done();
    });
  });
});
