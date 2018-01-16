import { SerializableClass } from '../../serializer';

export class User extends SerializableClass {
    constructor(
        private username: string,
        private password: string
    ) {
        super();
    }

    getUsername(): string {
        return this.username;
    }

    getPassword(): string {
        return this.password;
    }
}
