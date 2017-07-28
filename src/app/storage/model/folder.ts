import { Item } from './item';

export class Folder extends Item {

    constructor(
        name: string = null,
        private folders: Folder[] = [],
        private items: Item[] = []
    ) {
        super(name);
    }

    add(item: Item) {
        const list = item instanceof Folder ? this.folders : this.items;
        list.push(item);
        list.sort((a, b) => {
            return a.getName().localeCompare(b.getName());
        });
    }

    getFolders(): Folder[] {
        return this.folders;
    }

    getItems(): Item[] {
        return this.items;
    }

    getFolderByName(name: string): Folder {
        return this.folders.find((item) => {
            return item.getName() === name;
        })
    }
}
