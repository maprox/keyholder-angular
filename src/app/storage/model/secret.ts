import { Item } from './item';

export class Secret extends Item {
  static create(...rest): Secret {
    return new Secret(...rest);
  }

  constructor(
    name: string = '',
    private secret: string = '',
    private content: string = ''
  ) {
    super(name);
  }

  getClassName(): string {
    return 'Secret';
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
