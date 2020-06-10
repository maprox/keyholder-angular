import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Folder } from '../../model';
import { StorageService } from '../../storage.service';
import { EditFormComponentDirective } from '../edit-form';
import { EditFormFolderService } from './edit-form-folder.service';

@Component({
  selector: 'app-edit-form-folder',
  templateUrl: './edit-form-folder.component.html',
  styleUrls: ['./edit-form-folder.component.scss']
})
export class EditFormFolderComponent extends EditFormComponentDirective implements OnInit {
  constructor(
    protected router: Router,
    protected storage: StorageService,
    protected editFormFolderService: EditFormFolderService
  ) {
    super(storage, editFormFolderService);
  }

  submit() {
    if (this.isEditMode()) {
      this.save(this.itemSource);
    } else {
      const folder = new Folder(this.itemName);
      this.add(folder);
      this.storage.openFolder(folder);
      this.router.navigate(['/storage' + this.storage.getPathAsString()]);
    }
    super.submit();
  }
}
