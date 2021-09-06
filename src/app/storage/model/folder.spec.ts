import { Folder } from './folder';
import { Secret } from './secret';

describe('Folder', () => {
  it('should properly init models', () => {
    const folder = new Folder('test');
    const folders = [folder];
    const root = new Folder('root', folders, []);
    expect(root.getClassName()).toEqual('Folder');

    const secret = new Secret('Secret1');
    root.add(secret);
    root.add(new Secret('Secret2'));
    root.add(new Secret('Secret0'));

    const items = root.getItems();
    expect(items.length).toEqual(3);
    expect(items[0].getName()).toEqual('Secret0');
    expect(items[1].getName()).toEqual('Secret1');
    expect(items[2].getName()).toEqual('Secret2');

    expect(root.getFolders().length).toEqual(1);
    root.remove(folder);
    expect(items.length).toEqual(3);
    expect(root.getFolders().length).toEqual(0);
    root.remove(secret);
    expect(items.length).toEqual(2);
    expect(root.getFolders().length).toEqual(0);
  });

  // it('should search for an item inside the Folder', () => {
  //   const folderToFind = new Folder('find me');
  // });
});
