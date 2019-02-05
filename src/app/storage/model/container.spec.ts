import { Options } from '../../password-generator/model';
import { Container } from './container';
import { Folder } from './folder';

describe('Container', () => {
  it('should properly init models', () => {
    const root = new Folder('root');
    const container = new Container(root, new Options(), 1.1);
    expect(container.getVersion()).toEqual(1.1);
    expect(container.getClassName()).toEqual('Container');
  });
});
