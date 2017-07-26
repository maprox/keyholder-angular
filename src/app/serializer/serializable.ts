type Constructor<T> = new(...args: any[]) => T;

export interface Serializable {

    fromJSON(json: object): any;

    toJSON(): any;

}

export class SerializableClass implements Serializable {

    getClassName(): string {
        return this.constructor.name;
    }

    fromJSON(value: object): any {
        return Object.assign(this, value);
    }

    toJSON(): any {
        return Object.assign({}, this, {
            _type: this.getClassName(),
        });
    }
}

export function Serializable<T extends Constructor<object>>(superclass: T) {
    return class extends superclass {

        fromJSON(value: object): any {
            return Object.assign(this, value);
        }

        toJSON(): any {
            return Object.assign({}, this, {
                _type: this.constructor.name,
            });
        };

    };
}
