import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService } from '../../alert';
import { Folder, Item, Secret } from '../model';
import { EditFormFolderService } from '../storage-actions/edit-form-folder';
import { EditFormSecretService } from '../storage-actions/edit-form-secret';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.scss']
})
export class StorageListComponent implements OnInit {
  constructor(
    private alert: AlertService,
    private editFormFolderService: EditFormFolderService,
    private editFormSecretService: EditFormSecretService,
    private router: Router,
    public storage: StorageService
  ) {}

  ngOnInit() {
    //
  }

  asSecret(item: Item): Secret {
    return item instanceof Secret ? item as Secret : null;
  }

  clickItem(item: Item) {
    const secret = this.asSecret(item);
    if (!secret) {
      return;
    }

    // copy to clipboard
    this.alert.success('Successfully copied to clipboard', 2000);
  }

  clickFolder(item: Item) {
    this.storage.openFolder(item as Folder);
    this.router.navigate(['/storage' + this.storage.getPathAsString()]);
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
