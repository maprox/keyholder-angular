import { Injectable } from '@angular/core';

import { SerializerService } from '../serializer';
import { Folder } from './model';
import * as ItemType from './model';

@Injectable()
export class StorageService {

    private storageKey = 'storage';

    private path: Folder[] = [];

    private root: Folder;

    getPath(): Folder[] {
        if (this.path.length === 0) {
            this.path.push(this.getRoot());
        }
        return this.path;
    }

    getRoot(): Folder {
        if (!this.root) {
            this.root = new Folder('root');
        }
        return this.root;
    }

    getCurrent(): Folder {
        const path = this.getPath();
        return path[path.length - 1];
    }

    getParent(): Folder {
        const path = this.getPath();
        return (path.length > 1) ? path[path.length - 2] : null;
    }

    getPathAsString(): string {
        let result = '';
        this.getPath().map((item, index) => {
            if (index === 0) {
                // skip root folder
                return;
            }
            result += (result ? '/' : '') + item.getName();
        });
        return result;
    }

    openFolder(folder: Folder): Folder {
        if (this.getCurrent().hasFolder(folder)) {
            this.getPath().push(folder);
        } else {
            const position = this.path.indexOf(folder);
            if (position >= 0) {
                this.getPath().splice(position + 1);
            }
        }
        return folder;
    }

    openPath(path: string) {
        this.path = [this.getRoot()];
        path.split('/').splice(2).filter((item) => item).map((folderName: string) => {
            const folder = this.getCurrent().getFolderByName(folderName);
            this.openFolder(folder);
        });
    }

    isRoot(folder: Folder = this.getCurrent()): boolean {
        return folder === this.getRoot();
    }

    // TODO remove save and load from here

    save() {
        const data = JSON.stringify(this.root);
        localStorage.setItem(this.storageKey, data);
    }

    load() {
        const data = localStorage.getItem(this.storageKey);
        this.root = data ?
            JSON.parse(data, SerializerService.getReviver(ItemType)) :
            this.getRoot();
    }
}
