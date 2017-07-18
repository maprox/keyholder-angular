import { SerializableClass } from '../../serializer';

export class Item extends SerializableClass {

    constructor(
        private name: string = null
    ) {
        super();
    }

    setName(value: string) {
        this.name = value;
    }

    getName(): string {
        return this.name;
    }

}
