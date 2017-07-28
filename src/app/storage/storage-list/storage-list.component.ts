import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from '../storage.service';
import { Folder, Secret, Item } from '../model';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.css']
})
export class StorageListComponent implements OnInit {

    folders: Folder[];

    root: Folder;

    currentFolder: Folder;

    itemName: string;

    constructor(
        private router: Router,
        private storageService: StorageService
    ) { }

    ngOnInit() {
        this.root = this.storageService.getRoot();
        this.folders = [this.root];
        this.currentFolder = this.root;
    }

    asSecret(item: Item): Secret {
        return item instanceof Secret ? item as Secret : null;
    }

    getPath() {
        let result = '';
        this.folders.map((item) => {
            result += item.getName() + '/'
        });
        return result;
    }

    clickItem(item: Item) {
        if (!(item instanceof Folder)) {
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
        this.router.navigate(['/storage', this.getPath() || '']);
        console.log(this.getPath());
    }

    openPath(path: string) {
        const parts = path.split('/');
        //parts.
    }

    private addItem(currentFolder: Folder, item: Item) {
        currentFolder.add(item);
        this.storageService.save();
        console.log(this.getPath());
    }

    addFolder(currentFolder: Folder, itemName: string) {
        this.addItem(currentFolder, new Folder(itemName));
    }

    addSecret(currentFolder: Folder, itemName: string) {
        this.addItem(currentFolder, new Secret(itemName));
    }
}
