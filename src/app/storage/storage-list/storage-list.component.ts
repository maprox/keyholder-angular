import { Component, OnInit } from '@angular/core';

import { StorageService } from '../storage.service';
import { Folder, Secret, Item } from '../model';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.css']
})
export class StorageListComponent implements OnInit {

    folders: Folder[];

    currentFolder: Folder;

    constructor(
        private storageService: StorageService
    ) { }

    ngOnInit() {
        const root = this.storageService.getRoot();
        this.folders = [root];
        this.currentFolder = root;
    }

    isFolder(item: Item): boolean {
        return item instanceof Folder;
    }

    isSecret(item: Item): boolean {
        return item instanceof Secret;
    }

    asSecret(item: Item): Secret {
        return this.isSecret(item) ? item as Secret : null;
    }

    getPath() {
        let result = '';
        this.folders.map((item) => {
            result += item.getName() + '/'
        });
        return result;
    }

    clickItem(item: Item) {
        if (!this.isFolder(item)) {
            return;
        }
        const folder = item as Folder,
            position = this.folders.indexOf(folder);
        if (position >= 0) {
            this.folders.splice(position + 1);
            this.currentFolder = this.folders[this.folders.length - 1];
        } else {
            this.currentFolder = folder;
            this.folders.push(folder);
        }
    }
}
