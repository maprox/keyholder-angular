import { Serializable } from './serializable';

// declare the type for the reviver function
type ReviverCallbackFunction = (string, any) => any;

export class SerializerService {
    /**
     * @param {object} ItemType
     * @returns {ReviverCallbackFunction}
     */
    static getReviver(ItemType: object): ReviverCallbackFunction {
        return (key: string, value: any): any => {
            if (value && value._type) {
                const item: Serializable = new ItemType[value._type];

                // remove type information
                delete value._type;

                return item.fromJSON(value);
            }
            return value;
        }
    }
}
