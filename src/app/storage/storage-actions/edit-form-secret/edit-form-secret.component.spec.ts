import { DebugElement } from '@angular/core';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PasswordGeneratorService } from '../../../password-generator';
import { Folder, Secret } from '../../model';
import EditFormPage from '../edit-form/edit-form.component.spec';
import { EditFormSecretComponent } from './edit-form-secret.component';
import { EditFormSecretService } from './edit-form-secret.service';

describe('EditFormSecretComponent', () => {
  const password = 'super-secret!11!';
  let generationAttempt;
  let passwordGeneratorService;
  let editFormSecretService;
  let page: Page;

  class Page extends EditFormPage {
    componentInstance: EditFormSecretComponent;

    getFields(): ({ [key: string]: DebugElement }) {
      return {
        ...super.getFields(),
        details: this.getElementByCss('[data-cy=details]'),
        secret: this.getElementByCss('[name=secretValue]'),
        generate: this.getElementByCss('[data-cy=generate]'),
        notes: this.getElementByCss('[name=secretContent]'),
      };
    }

    setFieldSecretTo(text: string) {
      this.fields.secret.nativeElement.value = text;
      this.fields.secret.nativeElement.dispatchEvent(new Event('input'));
      this.detectChanges();
    }

    setFieldNotesTo(text: string) {
      this.fields.notes.nativeElement.value = text;
      this.fields.notes.nativeElement.dispatchEvent(new Event('input'));
      this.detectChanges();
    }

    seeDetails() {
      this.fields.details.nativeElement.click();
      this.detectChanges();
      tick();
    }

    generate() {
      this.fields.generate.nativeElement.click();
      this.detectChanges();
      tick();
    }
  }

  beforeEach(waitForAsync(() => {
    editFormSecretService = new EditFormSecretService();
    generationAttempt = 0;
    passwordGeneratorService = {
      generate: () => `${password}${generationAttempt++}`,
    };

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
      declarations: [
        EditFormSecretComponent,
      ],
      providers: [
        {
          provide: PasswordGeneratorService,
          useValue: passwordGeneratorService,
        },
        {
          provide: EditFormSecretService,
          useValue: editFormSecretService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    page = new Page(TestBed.createComponent(EditFormSecretComponent));
    page.detectChanges();
  });

  it('should be created', () => {
    expect(page.componentInstance).toBeTruthy();
    expect(page.form).toBeFalsy();
  });

  it('should open the form (new folder) and close', fakeAsync(() => {
    editFormSecretService.create();
    page.detectChanges();
    tick();

    expect(page.form).toBeTruthy();
    expect(page.headerName).toEqual('Add Secret');
    expect(page.fields.submit.nativeElement.innerText).toEqual('Add');

    editFormSecretService.close();
    page.detectChanges();

    expect(page.form).toBeFalsy();
  }));

  it('should open the form and create a secret', fakeAsync(() => {
    editFormSecretService.create();
    page.detectChanges();
    tick();

    const currentFolder = Folder.create('test');
    let newSecret: Secret;
    page.componentInstance.current = currentFolder;
    page.componentInstance.itemAdd.subscribe((item) => { newSecret = item as Secret });

    const newSecretName = 'new secret';
    page.setFieldNameTo(newSecretName);
    page.submit();

    expect(currentFolder.getItems()).toEqual([newSecret]);
    expect(newSecret.getName()).toEqual(newSecretName);
    expect(newSecret.getSecret()).toEqual(`${password}0`);
  }));

  it('should open the form and create a secret with a custom password and notes', fakeAsync(() => {
    editFormSecretService.create();
    page.detectChanges();
    tick();

    // let's check that notes and secret not available
    expect(page.fields.secret).toBeFalsy();
    expect(page.fields.notes).toBeFalsy();

    page.seeDetails();

    // now available
    expect(page.fields.secret).toBeTruthy();
    expect(page.fields.notes).toBeTruthy();
    expect(page.fields.secret.nativeElement.value).toEqual(`${password}0`);

    // generate another password
    page.generate();

    expect(page.fields.secret.nativeElement.value).toEqual(`${password}1`);

    const currentFolder = Folder.create('test');
    let newSecret: Secret;
    page.componentInstance.current = currentFolder;
    page.componentInstance.itemAdd.subscribe((item) => { newSecret = item as Secret });

    const newSecretName = 'new secret';
    const newSecretNote = 'This is a test note';
    page.setFieldNameTo(newSecretName);
    page.setFieldNotesTo(newSecretNote);
    page.submit();

    expect(currentFolder.getItems()).toEqual([newSecret]);
    expect(newSecret.getName()).toEqual(newSecretName);
    expect(newSecret.getSecret()).toEqual(`${password}1`);
    expect(newSecret.getContent()).toEqual(newSecretNote);
  }));

  it('should open the form and edit a secret', fakeAsync(() => {
    const initial = { name: 'secret1',  secret: 'abcdefg', content: '' };
    const changed = { name: 'superman', secret: 'is-dead', content: 'why so?' };
    const secret = Secret.create(initial.name, initial.secret, initial.content);

    editFormSecretService.edit(secret);
    page.detectChanges();
    tick();

    expect(page.headerName).toEqual('Edit Secret');
    expect(page.fields.details).toBeFalsy();
    expect(secret.getName()).toEqual(initial.name);
    expect(secret.getSecret()).toEqual(initial.secret);
    expect(secret.getContent()).toEqual(initial.content);

    expect(page.fields.name.nativeElement.value).toEqual(initial.name);
    expect(page.fields.submit.nativeElement.innerText).toEqual('Save');

    page.setFieldNameTo(changed.name);
    page.setFieldSecretTo(changed.secret);
    page.setFieldNotesTo(changed.content);
    page.submit();

    expect(secret.getName()).toEqual(changed.name);
    expect(secret.getSecret()).toEqual(changed.secret);
    expect(secret.getContent()).toEqual(changed.content);
  }));

  it('should open the form and remove a secret', fakeAsync(() => {
    const childSecret1 = Secret.create('child-1');
    const childSecret2 = Secret.create('child-2');
    const currentFolder = Folder.create('test', [], [childSecret1, childSecret2]);

    editFormSecretService.edit(childSecret1);
    page.detectChanges();
    tick();

    let removedSecret: Secret;
    page.componentInstance.current = currentFolder;
    page.componentInstance.itemRemove.subscribe((item) => { removedSecret = item as Secret });

    page.remove();

    expect(removedSecret).toEqual(childSecret1);
    expect(currentFolder.getItems()).toEqual([childSecret2]);
  }));
});
