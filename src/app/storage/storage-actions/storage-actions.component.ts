import { Component, OnInit } from '@angular/core';

import { PasswordGeneratorService } from '../../password-generator';
import { Folder, Item, Secret } from '../model';

import { StorageService } from '../storage.service';

@Component({
    selector: 'app-storage-actions',
    templateUrl: './storage-actions.component.html',
    styleUrls: ['./storage-actions.component.css']
})
export class StorageActionsComponent implements OnInit {
    showEditForm: string;
    itemName: string;

    constructor(private storage: StorageService,
                private passwordGenerator: PasswordGeneratorService) {
    }

    ngOnInit() {
    }

    private addItem(item: Item) {
        this.storage.getCurrent().add(item);
        this.storage.save();
        this.showEditForm = '';
        this.itemName = '';
    }

    showAddFolder(element: HTMLElement) {
        this.showEditForm = (this.showEditForm === 'folder') ? '' : 'folder';
        // element.focus();
    }

    showAddSecret(element: HTMLElement) {
        this.showEditForm = (this.showEditForm === 'secret') ? '' : 'secret';
        // element.focus();
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

    addSecret(itemName: string) {
        this.addItem(new Secret(itemName, this.passwordGenerator.generate()));
    }
}
