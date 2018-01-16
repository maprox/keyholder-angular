import { Component } from '@angular/core';

import { Folder, Item } from '../model';
import { StorageService } from '../storage.service';
import { EditFormFolderService } from './edit-form-folder';
import { EditFormSecretService } from './edit-form-secret';

@Component({
    selector: 'app-storage-actions',
    templateUrl: './storage-actions.component.html',
    styleUrls: ['./storage-actions.component.scss']
})
export class StorageActionsComponent {
    formType: string;

    constructor(
        private storage: StorageService,
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
