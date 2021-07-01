import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Folder } from '../model';
import { StorageService } from '../storage.service';

import { StoragePathComponent } from './storage-path.component';

describe('StoragePathComponent', () => {
  // let component: StoragePathComponent,
  //   fixture: ComponentFixture<StoragePathComponent>,
  //   routerMock,
  //   storageServiceMock;
  //
  // beforeEach(async(() => {
  //   routerMock = {
  //     navigate: jasmine.createSpy()
  //   };
  //   storageServiceMock = {
  //     openFolder: jasmine.createSpy(),
  //     getPathAsString: jasmine.createSpy(),
  //     getPath: jasmine.createSpy().and.returnValue([])
  //   };
  //
  //   TestBed.configureTestingModule({
  //     declarations: [
  //       StoragePathComponent
  //     ],
  //     providers: [
  //       {
  //         provide: Router,
  //         useValue: routerMock
  //       },
  //       {
  //         provide: StorageService,
  //         useValue: storageServiceMock
  //       }
  //     ]
  //   }).compileComponents();
  // }));
  //
  // beforeEach(() => {
  //   fixture = TestBed.createComponent(StoragePathComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });
  //
  // it('should be created', () => {
  //   expect(component).toBeTruthy();
  // });
  //
  // it('should open folder', () => {
  //   const folder = new Folder();
  //
  //   storageServiceMock.getPathAsString.and.returnValue('/some/path');
  //
  //   component.openFolder(folder);
  //
  //   expect(storageServiceMock.openFolder).toHaveBeenCalledWith(folder);
  //   expect(routerMock.navigate).toHaveBeenCalledWith(['/storage/some/path']);
  // });
});
