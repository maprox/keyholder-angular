import { Injectable } from '@angular/core';

import { SerializerService } from '../serializer';
import { Folder, Secret } from './model';
import * as ItemType from './model';

@Injectable()
export class StorageService {

    private root: Folder;

    private storageKey = 'storage';

    constructor() {
        const root = this.getRoot();
        root.add(new Folder('f1'));
        root.add(new Folder('f2', [
            new Folder('f2f1', [
                new Secret('s0', 'Hello virtual World!!!'),
            ]),
        ]));

        const f1 = new Folder('f3');
        root.add(f1);
        f1.add(new Secret('s1', 'this is some content'));

        this.save();
    }

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
        this.root = JSON.parse(data, SerializerService.getReviver(ItemType));
        console.log(this.root);
    }
}
