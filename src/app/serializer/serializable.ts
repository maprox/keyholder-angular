export interface Serializable {
    fromJSON(json: object): any;

    toJSON(): any;

    getClassName(): string;

    serialize(): string;
}

export class SerializableClass implements Serializable {
    getClassName(): string {
        throw new Error('getClassName() should be specified');
    }

    fromJSON(value: object): any {
        return Object.assign(this, value);
    }

    toJSON(): any {
        return Object.assign({}, this, {
            _type: this.getClassName()
        });
    }

    serialize(): string {
      return JSON.stringify(this);
    }
}
