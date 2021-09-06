import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Folder } from '../../model';
import EditFormPage from '../edit-form/edit-form.component.spec';
import { EditFormFolderComponent } from './edit-form-folder.component';
import { EditFormFolderService } from './edit-form-folder.service';

describe('EditFormFolderComponent', () => {
  let editFormFolderService;
  let page: Page;

  class Page extends EditFormPage {
    componentInstance: EditFormFolderComponent;
  }

  beforeEach(waitForAsync(() => {
    editFormFolderService = new EditFormFolderService();

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
      declarations: [
        EditFormFolderComponent,
      ],
      providers: [
        {
          provide: EditFormFolderService,
          useValue: editFormFolderService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    page = new Page(TestBed.createComponent(EditFormFolderComponent));
    page.detectChanges();
  });

  it('should be created', () => {
    expect(page.componentInstance).toBeTruthy();
    expect(page.form).toBeFalsy();
  });

  it('should open the form (new folder) and close', fakeAsync(() => {
    editFormFolderService.create();
    page.detectChanges();

    page.componentInstance.fieldName = null; // \_(o_O)_/ don't ask about this :D
    tick();

    page.detectChanges();
    expect(page.form).toBeTruthy();
    expect(page.headerName).toEqual('Add Folder');

    editFormFolderService.close();
    page.detectChanges();

    expect(page.form).toBeFalsy();
  }));

  it('should open the form and create a folder', fakeAsync(() => {
    editFormFolderService.create();
    page.detectChanges();
    tick();

    const currentFolder = Folder.create('test');
    let newFolder: Folder;
    page.componentInstance.current = currentFolder;
    page.componentInstance.itemAdd.subscribe((item) => { newFolder = item as Folder });

    page.setFieldNameTo('new folder');
    page.submit();

    expect(newFolder.getName()).toEqual('new folder');
    expect(currentFolder.getFolders()).toEqual([newFolder]);
  }));

  it('should open the form and edit a folder', fakeAsync(() => {
    const initialFolderName = 'test';
    const changedFolderName = 'changed';
    const folder = Folder.create(initialFolderName);

    editFormFolderService.edit(folder);
    page.detectChanges();
    tick();

    expect(page.form).toBeTruthy();
    expect(page.headerName).toEqual('Edit Folder');
    expect(folder.getName()).toEqual(initialFolderName);
    expect(page.fields.name.nativeElement.value).toEqual(initialFolderName);
    expect(page.fields.submit.nativeElement.innerText).toEqual('Save');

    page.setFieldNameTo(changedFolderName);
    page.submit();

    expect(folder.getName()).toEqual(changedFolderName);
  }));

  it('should open the form and remove a folder', fakeAsync(() => {
    const childFolder1 = Folder.create('child-1');
    const childFolder2 = Folder.create('child-2');
    const currentFolder = Folder.create('test', [childFolder1, childFolder2]);

    editFormFolderService.edit(childFolder1);
    page.detectChanges();
    tick();

    let removedFolder: Folder;
    page.componentInstance.current = currentFolder;
    page.componentInstance.itemRemove.subscribe((item) => { removedFolder = item as Folder });

    page.remove();

    expect(removedFolder).toEqual(childFolder1);
    expect(currentFolder.getFolders()).toEqual([childFolder2]);
  }));
});
