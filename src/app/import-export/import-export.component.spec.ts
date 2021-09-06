import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportExportComponent } from './import-export.component';

@Component({
  selector: 'app-import',
  template: '<div>Fake import component</div>'
})
class FakeImportComponent {}

@Component({
  selector: 'app-export',
  template: '<div>Fake export component</div>'
})
class FakeExportComponent {}

describe('ImportExportComponent', () => {
  let component: ImportExportComponent;
  let fixture: ComponentFixture<ImportExportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ImportExportComponent,
        FakeImportComponent,
        FakeExportComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
