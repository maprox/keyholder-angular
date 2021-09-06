import { Item } from './item';

export class Folder extends Item {
  static create(...rest): Folder {
    return new Folder(...rest);
  }

  constructor(
    name: string = '',
    private folders: Folder[] = [],
    private items: Item[] = []
  ) {
    super(name);
  }

  getClassName(): string {
    return 'Folder';
  }

  add(item: Item): Item {
    const list = item instanceof Folder ? this.folders : this.items;
    list.push(item);
    list.sort((a, b) => a.getName().localeCompare(b.getName()));
    return item;
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

  find(item: Folder, parents?: Folder[]): Folder[] {
    const foundItem = this.getFolders().find(child => child === item);
    if (foundItem) {
      return [...parents || [], foundItem];
    } else {
      return this.getFolders().reduce((result, folder) =>
        (result.length && result) || folder.find(item, [...parents || [], folder]), []);
    }
  }
}
