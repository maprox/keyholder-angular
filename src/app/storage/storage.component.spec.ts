import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageComponent } from './storage.component';

@Component({
  selector: 'app-storage-actions',
  template: '<div>Fake storage action component</div>'
})
class FakeStorageActionsComponent {}

@Component({
  selector: 'app-storage-path',
  template: '<div>Fake storage path component</div>'
})
class FakeStoragePathComponent {}

@Component({
  selector: 'app-storage-list',
  template: '<div>Fake storage list component</div>'
})
class FakeStorageListComponent {}

describe('StorageComponent', () => {
  let component: StorageComponent;
  let fixture: ComponentFixture<StorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StorageComponent,
        FakeStorageActionsComponent,
        FakeStoragePathComponent,
        FakeStorageListComponent,
      ]
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
});
