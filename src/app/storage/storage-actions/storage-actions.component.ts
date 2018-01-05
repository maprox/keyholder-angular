import { Component } from '@angular/core';

import { Folder, Item } from '../model';
import { StorageService } from '../storage.service';

@Component({
    selector: 'app-storage-actions',
    templateUrl: './storage-actions.component.html',
    styleUrls: ['./storage-actions.component.scss']
})
export class StorageActionsComponent {
    formType: string;

    constructor(
        private storage: StorageService
    ) {}

    showAddFolder() {
        this.formType = (this.formType === 'folder') ? '' : 'folder';
    }

    showAddSecret() {
        this.formType = (this.formType === 'secret') ? '' : 'secret';
    }

    removeCurrentFolder() {
        const current = this.storage.getCurrent(),
            parent = this.storage.getParent();

        if (parent) {
            this.storage.openFolder(parent).removeItem(current);
            this.storage.save();
        }
    }

    removeItem(folder: Folder, item: Item) {
        folder.removeItem(item);
        this.storage.save();
    }
}
