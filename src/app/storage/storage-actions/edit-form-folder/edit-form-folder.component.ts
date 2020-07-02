import { Component, OnInit } from '@angular/core';

import { Folder } from '../../model';
import { EditFormComponentDirective } from '../edit-form';
import { EditFormFolderService } from './edit-form-folder.service';

@Component({
  selector: 'app-edit-form-folder',
  templateUrl: './edit-form-folder.component.html',
  styleUrls: ['./edit-form-folder.component.scss']
})
export class EditFormFolderComponent extends EditFormComponentDirective implements OnInit {
  constructor(
    protected editFormFolderService: EditFormFolderService
  ) {
    super(editFormFolderService);
  }

  submit() {
    if (this.isEditMode()) {
      this.change(this.itemSource);
    } else {
      const folder = new Folder(this.itemName);
      this.add(folder);
    }
    super.submit();
  }
}
