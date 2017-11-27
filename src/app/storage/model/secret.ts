import { Item } from './item';

export class Secret extends Item {
    constructor(
        name: string = null,
        private secret: string = null,
        private content: string = null
    ) {
        super(name);
    }

    getSecret(): string {
        return this.secret;
    }

    setSecret(secret: string) {
        this.secret = secret;
    }

    getContent(): string {
        return this.content;
    }

    setContent(content: string) {
        this.content = content;
    }
}
