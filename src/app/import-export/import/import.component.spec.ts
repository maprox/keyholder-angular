import { DebugElement } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { AlertService } from '../../alert';

import { BasicTestWidget } from '../../mocks/basic-widget.spec';
import { Options } from '../../password-generator/model';
import { StorageApiService, StorageService } from '../../storage';
import { FileIoService } from '../file-io.service';

import { ImportComponent } from './import.component';

class TestWidget extends BasicTestWidget<ImportComponent> {
  fileInput: DebugElement;
  findElements() {
    this.fileInput = this.fixture.debugElement.query(By.css('input'));
  }
}

describe('ImportComponent', () => {
  let widget: TestWidget;
  let readFileSubject: Subject<string>;
  let saveSubject: Subject<Object>;
  let storageService;

  beforeEach(waitForAsync(() => {
    readFileSubject = new Subject<string>();
    saveSubject = new Subject<Object>();
    storageService = {
      setRoot: jasmine.createSpy(),
    };

    widget = new TestWidget();
    widget.compileComponents({
      declarations: [
        ImportComponent,
      ],
      providers: [
        {
          provide: StorageApiService,
          useValue: {
            save: jasmine.createSpy().and.returnValue(saveSubject),
            loadContainer: jasmine.createSpy(),
          },
        },
        {
          provide: StorageService,
          useValue: storageService,
        },
        {
          provide: AlertService,
          useValue: {
            error: jasmine.createSpy(),
            success: jasmine.createSpy(),
          },
        },
        {
          provide: FileIoService,
          useValue: {
            readFile: jasmine.createSpy().and.returnValue(readFileSubject),
          },
        },
      ],
    });
  }));

  beforeEach(() => {
    widget.createComponent(ImportComponent);
    widget.detectChanges();
  });

  it('should create', () => {
    expect(widget.getComponent()).toBeTruthy();
  });

  it('should import', () => {
    widget.fileInput.triggerEventHandler('change', {
      target: {
        files: [{
          contents: 'test',
        }],
      },
    });
    expect(widget.mocks[FileIoService.name].readFile).toHaveBeenCalledTimes(1);
    expect(widget.mocks[StorageApiService.name].loadContainer).toHaveBeenCalledTimes(0);

    const options = new Options();
    const contents = 'ENCRYPTEDTEXT';
    const container = {
      getStorage: () => 'test storage',
      getOptions: () => options,
    };
    widget.mocks[StorageApiService.name].loadContainer.and.returnValue(container);
    readFileSubject.next(contents);
    expect(widget.mocks[StorageApiService.name].loadContainer).toHaveBeenCalledTimes(1);
    expect(widget.mocks[StorageApiService.name].loadContainer).toHaveBeenCalledWith(contents);
    expect(widget.mocks[StorageApiService.name].save).toHaveBeenCalledTimes(1);
    expect(widget.mocks[StorageApiService.name].save).toHaveBeenCalledWith('test storage', options);
    saveSubject.next();
    expect(widget.mocks[AlertService.name].success).toHaveBeenCalledWith(
      'Successfully imported!');
  });

  it('should handle failed import (no files selected)', () => {
    widget.fileInput.triggerEventHandler('change', {
      target: {
        files: [],
      },
    });
    expect(widget.mocks[FileIoService.name].readFile).toHaveBeenCalledTimes(0);
  });

  it('should handle failed import (error reading file)', () => {
    widget.fileInput.triggerEventHandler('change', {
      target: {
        files: [{
          contents: 'test',
        }],
      },
    });
    expect(widget.mocks[FileIoService.name].readFile).toHaveBeenCalledTimes(1);
    readFileSubject.error('No permissions!');
    expect(widget.mocks[AlertService.name].error).toHaveBeenCalledWith(
      'Import failed! Error reading the file! No permissions!');
    expect(widget.mocks[StorageApiService.name].loadContainer).toHaveBeenCalledTimes(0);
  });

  it('should handle failed import (error reading file - empty error)', () => {
    widget.fileInput.triggerEventHandler('change', {
      target: {
        files: [{
          contents: 'test',
        }],
      },
    });
    expect(widget.mocks[FileIoService.name].readFile).toHaveBeenCalledTimes(1);
    readFileSubject.error('');
    expect(widget.mocks[AlertService.name].error).toHaveBeenCalledWith(
      'Import failed! Error reading the file! ');
    expect(widget.mocks[StorageApiService.name].loadContainer).toHaveBeenCalledTimes(0);
  });

  it('should handle failed import (error decrypting)', () => {
    widget.fileInput.triggerEventHandler('change', {
      target: {
        files: [{
          contents: 'test',
        }],
      },
    });
    const contents = 'ENCRYPTEDTEXT';
    widget.mocks[StorageApiService.name].loadContainer.and.returnValue(null);
    readFileSubject.next(contents);
    expect(widget.mocks[StorageApiService.name].loadContainer).toHaveBeenCalledTimes(1);
    expect(widget.mocks[StorageApiService.name].loadContainer).toHaveBeenCalledWith(contents);
    expect(widget.mocks[AlertService.name].error).toHaveBeenCalledWith(
      'Import failed! Error decrypting file contents!');
  });

  it('should handle failed import (error saving the storage)', () => {
    widget.fileInput.triggerEventHandler('change', {
      target: {
        files: [{
          contents: 'test',
        }],
      },
    });
    const contents = 'ENCRYPTEDTEXT';
    const container = {
      getStorage: () => 'test storage',
      getOptions: () => new Options(),
    };
    widget.mocks[StorageApiService.name].loadContainer.and.returnValue(container);
    readFileSubject.next(contents);
    expect(widget.mocks[StorageApiService.name].loadContainer).toHaveBeenCalledTimes(1);
    expect(widget.mocks[StorageApiService.name].loadContainer).toHaveBeenCalledWith(contents);
    saveSubject.error({});
    expect(widget.mocks[AlertService.name].error).toHaveBeenCalledWith(
      'Import failed! Error saving the storage!');
  });
});

