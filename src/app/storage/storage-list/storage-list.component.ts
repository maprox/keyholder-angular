import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AlertService } from '../../alert';
import { Folder, Item, Secret } from '../model';
import { EditFormFolderService } from '../storage-actions/edit-form-folder';
import { EditFormSecretService } from '../storage-actions/edit-form-secret';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.scss']
})
export class StorageListComponent {
  @Input() parent: Folder;
  @Input() current: Folder;

  @Output() folderClicked = new EventEmitter<Folder>();

  constructor(
    private alert: AlertService,
    private editFormFolderService: EditFormFolderService,
    private editFormSecretService: EditFormSecretService,
  ) {}

  asSecret(item: Item): Secret {
    return item instanceof Secret ? item as Secret : null;
  }

  clickSecret(item: Item) {
    // copy to clipboard
    this.alert.success('Successfully copied to clipboard', 2000);
  }

  clickFolder(item: Item) {
    this.folderClicked.emit(item as Folder);
  }

  editSecret(item: Item) {
    this.editFormSecretService.edit(item);
    this.editFormFolderService.close();
    window.scroll(0, 0);
  }

  editFolder(item: Item) {
    this.editFormFolderService.edit(item);
    this.editFormSecretService.close();
    window.scroll(0, 0);
  }
}
