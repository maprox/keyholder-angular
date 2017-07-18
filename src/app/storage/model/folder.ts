import { Item } from './item';

export class Folder extends Item {

    constructor(
        name: string = null,
        private items: Item[] = []
    ) {
        super(name);
    }

    add(item: Item) {
        this.items.push(item);
    }

}
