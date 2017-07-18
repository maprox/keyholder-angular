import { Item } from './item';

export class Secret extends Item {

    constructor(
        name: string = null,
        private content: string = null
    ) {
        super(name);
    }

    getContent(): string {
        return this.content;
    }

    setContent(content: string) {
        this.content = content;
    }

}
