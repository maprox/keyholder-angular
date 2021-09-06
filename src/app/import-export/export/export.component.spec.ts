import { DebugElement } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { BasicTestWidget } from '../../mocks/basic-widget.spec';
import { StorageApiService, StorageService } from '../../storage';
import { FileIoService } from '../file-io.service';

import { ExportComponent } from './export.component';

class TestWidget extends BasicTestWidget<ExportComponent> {
  export: DebugElement;
  findElements() {
    this.export = this.fixture.debugElement.query(By.css('button.btn-success'));
  }
}

describe('ExportComponent', () => {
  let widget: TestWidget;
  let storageApiSubject;

  beforeEach(waitForAsync(() => {
    storageApiSubject = new Subject<Object>();

    widget = new TestWidget();
    widget.compileComponents({
      declarations: [
        ExportComponent,
      ],
      providers: [
        {
          provide: StorageApiService,
          useValue: {
            load: jasmine.createSpy().and.returnValue(storageApiSubject),
            getEncryptedContainer: jasmine.createSpy().and.returnValue('fake container'),
          },
        },
        {
          provide: FileIoService,
          useValue: {
            saveAs: jasmine.createSpy(),
          },
        },
      ],
    });
  }));

  beforeEach(() => {
    widget.createComponent(ExportComponent);
    widget.detectChanges();
  });

  beforeEach(() => {
    jasmine.clock().install();
    const baseTime = new Date(2015, 1, 23, 10, 30, 50);
    jasmine.clock().mockDate(baseTime);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(widget.getComponent()).toBeTruthy();
  });

  it('should export', () => {
    widget.export.nativeElement.click();
    expect(widget.mocks[StorageApiService.name].getEncryptedContainer)
      .toHaveBeenCalledTimes(1);
    expect(widget.mocks[FileIoService.name].saveAs).toHaveBeenCalledTimes(1);
    expect(widget.mocks[FileIoService.name].saveAs.calls.argsFor(0)).toEqual([
      new Blob(['fake container'], { type: 'text/plain' }),
      'storage-backup-2015-02-23T10-30-50.kh',
    ]);
  });
});
