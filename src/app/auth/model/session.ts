import { SerializableClass } from '../../serializer';

export class Session extends SerializableClass {
  constructor(
    private token: string,
    private data: string
  ) {
    super();
  }

  getClassName(): string {
    return 'Session';
  }

  getToken(): string {
    return this.token;
  }
}
