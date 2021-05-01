import { Component, EventEmitter, Input, Output } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { AuthService } from '../auth';
import { Folder, Item } from './model';

import { StorageComponent } from './storage.component';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-storage-actions',
  template: '<div>Fake storage action component</div>'
})
class FakeStorageActionsComponent {
  @Input() current: Folder;
  @Output() itemAdd = new EventEmitter<Item>();
  @Output() itemRemove = new EventEmitter<Item>();
  @Output() itemChange = new EventEmitter<Item>();
}

@Component({
  selector: 'app-storage-path',
  template: '<div>Fake storage path component</div>'
})
class FakeStoragePathComponent {
  @Input() root: Folder;
  @Input() current: Folder;
  @Output() folderClicked = new EventEmitter<Folder>();
}

@Component({
  selector: 'app-storage-list',
  template: '<div>Fake storage list component</div>'
})
class FakeStorageListComponent {
  @Input() parent: Folder;
  @Input() current: Folder;
  @Output() folderClicked = new EventEmitter<Folder>();
}

describe('StorageComponent', () => {
  let component: StorageComponent;
  let fixture: ComponentFixture<StorageComponent>;
  let authService;
  let getAuthEventSubject;
  let storageService;
  let onChangeSubject;

  beforeEach(async(() => {
    getAuthEventSubject = new Subject<Object>();
    authService = {
      getAuthEvent: jasmine.createSpy().and.returnValue(getAuthEventSubject),
    };
    onChangeSubject = new Subject<Object>();
    storageService = {
      onChange: jasmine.createSpy().and.returnValue(getAuthEventSubject),
    };
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'storage', component: StorageComponent },
        ]),
      ],
      declarations: [
        StorageComponent,
        FakeStorageActionsComponent,
        FakeStoragePathComponent,
        FakeStorageListComponent,
      ],
      providers: [
        {
          provide: StorageService,
          useValue: storageService,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate', () => {
    expect(component).toBeTruthy();
    // const router = TestBed.get(Router);
    // router.navigate('test');
  });
});
