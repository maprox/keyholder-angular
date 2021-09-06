import { Folder, Secret } from '../storage/model';

export function getSimpleRoot() {
  return new Folder('/');
}

export function getSophisticatedRoot() {
  return new Folder('/', [
    new Folder('alpha', [
      new Folder('alpha-sub-folder1', [
        new Folder('alpha-sub-folder1-sub-folder1'),
        new Folder('alpha-sub-folder1-sub-folder2'),
      ], [
        new Secret('asf-1', 'abc', 'test note'),
      ]),
      new Folder('alpha-sub-folder2', [], []),
    ]),
    new Folder('bravo'),
    new Folder('charlie'),
  ], [
    new Secret(
      'root-secret-name',
      'root-secret-text',
      'root-secret-contents',
    ),
  ]);
}
