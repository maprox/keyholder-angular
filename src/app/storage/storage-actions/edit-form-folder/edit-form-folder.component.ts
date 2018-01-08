import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Folder, Item, Secret } from '../../model';
import { StorageService } from '../../storage.service';
import { EditFormFolderService } from './edit-form-folder.service';

@Component({
    selector: 'app-edit-form-folder',
    templateUrl: './edit-form-folder.component.html',
    styleUrls: ['./edit-form-folder.component.scss']
})
export class EditFormFolderComponent implements OnInit {
    @ViewChild('fieldName') fieldName: ElementRef;

    isActive = false;

    itemSource: Item;
    itemName: string;

    constructor(
        private storage: StorageService,
        private editFormFolderService: EditFormFolderService
    ) {}

    ngOnInit() {
        this.editFormFolderService.getEditEvent().subscribe(this.open.bind(this));
    }

    open(item: Secret) {
        this.itemSource = item;
        this.itemName = item && item.getName() || '';
        this.focusName();
        this.isActive = true;
    }

    close() {
        this.isActive = false;
    }

    private addItem(item: Item) {
        this.storage.getCurrent().add(item);
        this.storage.save();
        this.close();
    }

    private focusName() {
        setTimeout(() => {
            if (this.fieldName && this.fieldName.nativeElement) {
                this.fieldName.nativeElement.focus();
            }
        });
    }

    removeItem(folder: Folder, item: Item) {
        folder.removeItem(item);
        this.storage.save();
    }

    submit() {
        const folder = new Folder(this.itemName);
        this.addItem(folder);
        this.storage.openFolder(folder);
    }
}
