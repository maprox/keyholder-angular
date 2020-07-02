import { Option } from '@angular/cli/models/interface';
import { Options } from '../../password-generator/model';
import { SerializableClass } from '../../serializer';
import { Folder } from './folder';

const VERSION = 1.0;

export class Container extends SerializableClass {
  constructor(
    public storage: Folder,
    public options: Options,
    public version: number = VERSION
  ) {
    super();
  }

  getClassName(): string {
    return 'Container';
  }

  getVersion(): number {
    return this.version;
  }

  getStorage(): Folder {
    return this.storage;
  }

  getOptions(): Options {
    return this.options;
  }

  setStorage(storage: Folder) {
    this.storage = storage;
  }

  setOptions(options: Options) {
    this.options = options;
  }
}
