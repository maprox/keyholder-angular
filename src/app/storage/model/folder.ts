import { Item } from './item';

export class Folder extends Item {
    constructor(
        name: string = null,
        private folders: Folder[] = [],
        private items: Item[] = []
    ) {
        super(name);
    }

    getClassName(): string {
        return 'Folder';
    }

    add(item: Item) {
        const list = item instanceof Folder ? this.folders : this.items;
        list.push(item);
        list.sort((a, b) => a.getName().localeCompare(b.getName()));
    }

    getFolders(): Folder[] {
        return this.folders;
    }

    getItems(): Item[] {
        return this.items;
    }

    getFolderByName(name: string): Folder {
        return this.folders.find((item) => item.getName() === name);
    }

    hasFolder(folder: Folder): boolean {
        return this.folders.indexOf(folder) >= 0;
    }

    isEmpty(): boolean {
        return !this.items.length && !this.folders.length;
    }

    remove(item: Item) {
        const list = item instanceof Folder ? this.folders : this.items;
        list.splice(list.indexOf(item), 1);
    }
}
