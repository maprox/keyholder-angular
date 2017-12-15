import { Component, ElementRef, ViewChild } from '@angular/core';

import { PasswordGeneratorService } from '../../password-generator';
import { Folder, Item, Secret } from '../model';
import { StorageService } from '../storage.service';

@Component({
    selector: 'app-storage-actions',
    templateUrl: './storage-actions.component.html',
    styleUrls: ['./storage-actions.component.scss']
})
export class StorageActionsComponent {
    @ViewChild('secretName') secretName: ElementRef;
    @ViewChild('folderName') folderName: ElementRef;

    detailsShown = false;
    formType: string;

    itemName: string;
    itemSecret: string;
    itemContent: string;

    constructor(
        private storage: StorageService,
        private passwordGenerator: PasswordGeneratorService
    ) {}

    private addItem(item: Item) {
        this.storage.getCurrent().add(item);
        this.storage.save();
        this.formType = '';
        this.itemName = '';
        this.itemSecret = '';
        this.itemContent = '';
    }

    private focus(element: string) {
        setTimeout(() => {
            if (this[element] && this[element].nativeElement) {
                this[element].nativeElement.focus();
            }
        });
    }

    showAddFolder() {
        this.formType = (this.formType === 'folder') ? '' : 'folder';
        if (this.formType === 'folder') {
            this.focus('folderName');
        }
    }

    showAddSecret() {
        this.formType = (this.formType === 'secret') ? '' : 'secret';
        if (this.formType === 'secret') {
            this.detailsShown = false;
            this.generate();
            this.focus('secretName');
        }
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

    addFolder(itemName: string) {
        const folder = new Folder(itemName);
        this.addItem(folder);
        this.storage.openFolder(folder);
    }

    addSecret() {
        this.addItem(new Secret(
            this.itemName,
            this.itemSecret,
            this.itemContent
        ));
    }

    generate() {
        this.itemSecret = this.passwordGenerator.generate();
    }
}
