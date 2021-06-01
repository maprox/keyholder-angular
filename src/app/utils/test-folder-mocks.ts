import { Folder, Secret } from '../storage/model';

export function getSimpleRoot() {
  return new Folder('/');
}

export function getSophisticatedRoot() {
  const root = getSimpleRoot();

  const alpha = new Folder('alpha');
  alpha.add(new Secret('test', 'this', 'thing'));
  alpha.add(new Secret('another', 'one', 'thing'));
  root.add(alpha);

  root.add(new Folder('bravo'));
  root.add(new Folder('charlie'));
  root.add(new Folder('delta'));

  return root;
}
