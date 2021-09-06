import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';

import { AuthService } from '../auth';

import TestComponentWrapper from '../utils/test-component-wrapper';
import { getSimpleRoot, getSophisticatedRoot } from '../utils/test-folder-mocks';
import { Folder, Item, Secret } from './model';

import { StorageComponent } from './storage.component';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-storage-actions',
  template: `
    <div>Fake storage action component</div>
    <div data-cy="current-folder">{{ current?.getName() }}</div>
  `
})
class FakeStorageActionsComponent {
  @Input() current: Folder = new Folder('e');
  @Output() itemAdd = new EventEmitter<Item>();
  @Output() itemRemove = new EventEmitter<Item>();
  @Output() itemChange = new EventEmitter<Item>();
}

@Component({
  selector: 'app-storage-path',
  template: `
    <div>Fake storage path component</div>
    <div data-cy="root-folder">{{ root?.getName() }}</div>
    <div data-cy="current-folder">{{ current?.getName() }}</div>
  `
})
class FakeStoragePathComponent {
  @Input() root: Folder;
  @Input() current: Folder;
  @Output() folderClicked = new EventEmitter<Folder>();
}

@Component({
  selector: 'app-storage-list',
  template: `
    <div>Fake storage list component</div>
    <div data-cy="parent-folder">{{ parent?.getName() }}</div>
    <div data-cy="current-folder">{{ current?.getName() }}</div>
  `
})
class FakeStorageListComponent {
  @Input() parent: Folder;
  @Input() current: Folder;
  @Output() folderClicked = new EventEmitter<Folder>();
}

describe('StorageComponent', () => {
  let authService;
  let getAuthEventSubject;
  let onChangeSubject;
  let page: Page;
  let storageService;
  let storageRoot: Folder;

  class Page extends TestComponentWrapper {
    componentInstance: StorageComponent;

    appStorageActions: DebugElement;
    appStoragePath: DebugElement;
    appStorageList: DebugElement;

    get storageActionsCurrentPageName() {
      const currentFolder = this.appStorageActions.query(By.css('div[data-cy="current-folder"]'));
      return currentFolder.nativeElement.innerText;
    }

    detectChanges() {
      super.detectChanges();
      this.appStorageActions = this.getElementByCss('app-storage-actions');
      this.appStoragePath = this.getElementByCss('app-storage-path');
      this.appStorageList = this.getElementByCss('app-storage-list');
    }
  }

  beforeEach(waitForAsync(() => {
    getAuthEventSubject = new Subject<Object>();
    authService = {
      isLoggedIn: jasmine.createSpy().and.returnValue(true),
      getAuthEvent: jasmine.createSpy().and.returnValue(getAuthEventSubject),
    };
    onChangeSubject = new Subject<Object>();
    storageRoot = getSophisticatedRoot();
    storageService = {
      isAvailable: false,
      isInSearchMode: false,
      getRoot: jasmine.createSpy().and.returnValue(storageRoot),
      onChange: jasmine.createSpy().and.returnValue(onChangeSubject),
      load: jasmine.createSpy(),
      save: jasmine.createSpy(),
    };
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'storage',
            children: [{
              path: '**',
              component: StorageComponent,
            }],
          },
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
    page = new Page(TestBed.createComponent(StorageComponent), { router: true });
    page.detectChanges();
  });

  it('should be created', () => {
    expect(page.componentInstance).toBeTruthy();
  });

  it('should do nothing if logged out', (done) => {
    expect(storageService.load).toHaveBeenCalledTimes(0);
    page.whenStable(() => {
      authService.isLoggedIn = () => false;
      page.router.navigate(['/storage']).then(() => {
        expect(storageService.load).toHaveBeenCalledTimes(0);
        done();
      });
    });
  });

  it('should do nothing if not storage related path', (done) => {
    expect(storageService.load).toHaveBeenCalledTimes(0);
    page.whenStable(() => {
      page.router.navigate(['/not-storage']).finally(() => {
        expect(authService.isLoggedIn).toHaveBeenCalledTimes(0);
        expect(storageService.load).toHaveBeenCalledTimes(0);
        done();
      });
    });
  });

  it('should load storage data if not yet available', (done) => {
    expect(storageService.load).toHaveBeenCalledTimes(0);
    page.whenStable(() => {
      page.router.navigate(['/storage']).then(() => {
        expect(authService.isLoggedIn).toHaveBeenCalledTimes(1);
        expect(storageService.load).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  it('should set current folder if storage data is available', (done) => {
    expect(storageService.load).toHaveBeenCalledTimes(0);
    page.whenStable(() => {
      storageService.isAvailable = true;
      page.router.navigate(['/storage/alpha']).then(() => {
        expect(authService.isLoggedIn).toHaveBeenCalledTimes(1);
        expect(storageService.load).toHaveBeenCalledTimes(0);

        page.fixture.detectChanges();
        expect(page.storageActionsCurrentPageName).toEqual('alpha');

        onChangeSubject.next(getSimpleRoot());
        page.fixture.detectChanges();
        expect(page.storageActionsCurrentPageName).toEqual('/');

        done();
      });
    });
  });

  it('should change current folder when root has been changed', () => {
    onChangeSubject.next(getSimpleRoot());
    page.fixture.detectChanges();
    expect(page.storageActionsCurrentPageName).toEqual('/');
  });

  it('should update route when clicked on a folder (and navigate)', (done) => {
    onChangeSubject.next(storageRoot);
    page.fixture.detectChanges();
    expect(page.storageActionsCurrentPageName).toEqual('/');

    const navigate = spyOn(page.router, 'navigate');
    const folder = storageRoot.getFolderByName('alpha');
    page.whenStable(() => {
      page.appStoragePath.componentInstance.folderClicked.emit(folder);
      page.fixture.detectChanges();
      expect(page.storageActionsCurrentPageName).toEqual('alpha');
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith(['/storage/alpha']);
      done();
    });
  });

  it('should update route when clicked on a folder and in a search mode', (done) => {
    onChangeSubject.next(storageRoot);
    page.fixture.detectChanges();

    const navigate = spyOn(page.router, 'navigate');
    const folder = storageRoot.getFolderByName('alpha');
    page.whenStable(() => {
      storageService.isInSearchMode = true;
      page.appStoragePath.componentInstance.folderClicked.emit(folder);
      page.fixture.detectChanges();
      expect(page.storageActionsCurrentPageName).toEqual('alpha');
      expect(navigate).toHaveBeenCalledTimes(0);
      done();
    });
  });

  it('should add a folder', (done) => {
    onChangeSubject.next(storageRoot);
    page.fixture.detectChanges();

    page.whenStable(() => {
      page.appStorageActions.componentInstance.itemAdd.emit(new Folder('test'));
      page.appStorageActions.componentInstance.itemAdd.emit(new Secret('test', 'secret'));
      page.fixture.detectChanges();
      expect(storageService.save).toHaveBeenCalledTimes(2);
      expect(page.storageActionsCurrentPageName).toEqual('test');
      done();
    });
  });

  it('should remove an item', (done) => {
    page.whenStable(() => {
      page.appStorageActions.componentInstance.itemRemove.emit(new Folder('test'));
      page.fixture.detectChanges();
      expect(storageService.save).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should change an item', (done) => {
    page.whenStable(() => {
      page.appStorageActions.componentInstance.itemChange.emit(new Folder('test'));
      page.fixture.detectChanges();
      expect(storageService.save).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should return empty path if root is not set', () => {
    expect(page.componentInstance.getCurrentPathAsString()).toEqual('/');
  });

  it('should return correct current path', (done) => {
    onChangeSubject.next(storageRoot);
    page.fixture.detectChanges();

    const navigate = spyOn(page.router, 'navigate');
    const folder = storageRoot.getFolderByName('alpha').getFolderByName('alpha-sub-folder1');
    page.whenStable(() => {
      page.appStoragePath.componentInstance.folderClicked.emit(folder);
      page.fixture.detectChanges();
      expect(page.storageActionsCurrentPageName).toEqual('alpha-sub-folder1');
      expect(page.componentInstance.getCurrentPathAsString()).toEqual('/alpha/alpha-sub-folder1');
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith(['/storage/alpha/alpha-sub-folder1']);
      done();
    });
  });

  it('should check storage root items', () => {
    // check folders
    const alpha = storageRoot.getFolderByName('alpha');
    const alphaSubFolder1 = alpha.getFolderByName('alpha-sub-folder1');
    const alphaSubFolder2 = alpha.getFolderByName('alpha-sub-folder2');
    expect(storageRoot.hasFolder(alpha)).toBeTruthy();
    expect(storageRoot.hasFolder(alphaSubFolder1)).toBeFalsy();
    expect(alpha.isEmpty()).toBeFalsy();
    expect(alphaSubFolder1.isEmpty()).toBeFalsy();
    expect(alphaSubFolder2.isEmpty()).toBeTruthy();

    // check secrets
    expect(alphaSubFolder1.getItems().length).toEqual(1);
    const alphaSubFolder1Secret = (alphaSubFolder1.getItems()[0] as Secret);
    expect(alphaSubFolder1Secret.getName()).toEqual('asf-1');
    expect(alphaSubFolder1Secret.getSecret()).toEqual('abc');
    expect(alphaSubFolder1Secret.getContent()).toEqual('test note');

    alphaSubFolder1Secret.setName('asf-2');
    alphaSubFolder1Secret.setSecret('new-abc');
    alphaSubFolder1Secret.setContent('');
    expect(alphaSubFolder1Secret.getName()).toEqual('asf-2');
    expect(alphaSubFolder1Secret.getSecret()).toEqual('new-abc');
    expect(alphaSubFolder1Secret.getContent()).toEqual('');
  });
});
