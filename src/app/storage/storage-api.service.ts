import { Injectable } from '@angular/core';

import { SerializerService } from '../serializer';
import { Folder } from './model';
import * as ItemType from './model';

@Injectable()
export class StorageApiService {
    private storageKey = 'storage';

    save(root: Folder) {
        const data = JSON.stringify(root);
        localStorage.setItem(this.storageKey, data);
    }

    load(): Folder {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data, SerializerService.getReviver(ItemType)) : null;
    }
}
