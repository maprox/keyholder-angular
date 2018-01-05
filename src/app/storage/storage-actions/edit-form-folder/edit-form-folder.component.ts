import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Folder, Item } from '../../model';
import { StorageService } from '../../storage.service';

@Component({
    selector: 'app-edit-form-folder',
    templateUrl: './edit-form-folder.component.html',
    styleUrls: ['./edit-form-folder.component.scss']
})
export class EditFormFolderComponent implements OnInit {
    @ViewChild('fieldName') fieldName: ElementRef;

    itemName: string;

    constructor(
        private storage: StorageService
    ) {}

    ngOnInit() {
        this.focusName();
    }

    private addItem(item: Item) {
        this.storage.getCurrent().add(item);
        this.storage.save();
        this.itemName = '';
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
