import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { StorageService } from '../storage.service';
import { Folder, Secret, Item } from '../model';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.css']
})
export class StorageListComponent implements OnInit {

    showEditForm: string;
    itemName: string;

    constructor(
        private router: Router,
        private storage: StorageService
    ) {
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.storage.openPath(decodeURIComponent(event.url));
            }
        });
    }

    ngOnInit() {
        //
    }

    asSecret(item: Item): Secret {
        return item instanceof Secret ? item as Secret : null;
    }

    clickItem(item: Item) {
        if (!(item instanceof Folder)) {
            return;
        }
        this.storage.openFolder(item as Folder);
        this.router.navigate(['/storage', this.storage.getPathAsString()]);
    }

    private addItem(item: Item) {
        this.storage.getCurrent().add(item);
        this.storage.save();
        this.showEditForm = '';
        this.itemName = '';
    }

    showAddFolder() {
        this.showEditForm = 'folder';
    }

    showAddSecret() {
        this.showEditForm = 'secret';
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
        this.addItem(new Secret(itemName));
    }
}
