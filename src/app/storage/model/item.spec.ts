import { Item } from './item';

describe('Item', () => {
  it('should properly init models', () => {
    const item = new Item();
    expect(item.getName()).toEqual('');
  });
});
