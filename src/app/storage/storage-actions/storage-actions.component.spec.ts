import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageActionsComponent } from './storage-actions.component';

describe('StorageActionsComponent', () => {
  let component: StorageActionsComponent;
  let fixture: ComponentFixture<StorageActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
