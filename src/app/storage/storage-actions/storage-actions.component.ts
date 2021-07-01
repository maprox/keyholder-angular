import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Folder, Item } from '../model';
import { EditFormFolderService } from './edit-form-folder';
import { EditFormSecretService } from './edit-form-secret';

@Component({
  selector: 'app-storage-actions',
  templateUrl: './storage-actions.component.html',
  styleUrls: ['./storage-actions.component.scss'],
})
export class StorageActionsComponent {
  @Input() current: Folder;

  @Output() itemAdd = new EventEmitter<Item>();
  @Output() itemRemove = new EventEmitter<Item>();
  @Output() itemChange = new EventEmitter<Item>();

  constructor(
    private editFormSecretService: EditFormSecretService,
    private editFormFolderService: EditFormFolderService
  ) {}

  showAddFolder() {
    this.editFormFolderService.create();
    this.editFormSecretService.close();
  }

  showAddSecret() {
    this.editFormSecretService.create();
    this.editFormFolderService.close();
  }
}
