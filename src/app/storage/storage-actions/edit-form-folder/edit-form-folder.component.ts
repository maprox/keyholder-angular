import { Component, OnInit } from '@angular/core';

import { Folder, Secret } from '../../model';
import { StorageService } from '../../storage.service';
import { EditFormComponent } from '../edit-form';
import { EditFormFolderService } from './edit-form-folder.service';

@Component({
    selector: 'app-edit-form-folder',
    templateUrl: './edit-form-folder.component.html',
    styleUrls: ['./edit-form-folder.component.scss']
})
export class EditFormFolderComponent extends EditFormComponent implements OnInit {
    constructor(
        protected storage: StorageService,
        protected editFormFolderService: EditFormFolderService
    ) {
        super(storage, editFormFolderService);
    }

    open(item: Secret) {
        this.itemSource = item;
        this.itemName = item && item.getName() || '';
        this.focusName();
        this.isActive = true;
    }

    submit() {
        const folder = new Folder(this.itemName);
        this.addItem(folder);
        this.storage.openFolder(folder);
    }
}
