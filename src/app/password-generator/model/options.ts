import { SerializableClass } from '../../serializer';

export class Options extends SerializableClass {
    constructor(
        public length: number = 30,
        public useNumbers: boolean = true,
        public useSymbols: boolean = true,
        public useLowercase: boolean = true,
        public useUppercase: boolean = true
    ) {
        super();
    }

    getClassName(): string {
        return 'Options';
    }
}
