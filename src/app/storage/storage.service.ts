import { Injectable } from '@angular/core';

import { SerializerService } from '../serializer';
import { Folder } from './model';
import * as ItemType from './model';

@Injectable()
export class StorageService {

    private root: Folder;

    private storageKey = 'storage';

    getRoot(): Folder {
        if (!this.root) {
            this.root = new Folder('root');
        }
        return this.root;
    }

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
