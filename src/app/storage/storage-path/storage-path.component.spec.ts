import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoragePathComponent } from './storage-path.component';

describe('StoragePathComponent', () => {
  let component: StoragePathComponent;
  let fixture: ComponentFixture<StoragePathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoragePathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoragePathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
