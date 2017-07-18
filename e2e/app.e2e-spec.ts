import { KeyholderAngularPage } from './app.po';

describe('keyholder-angular App', () => {
  let page: KeyholderAngularPage;

  beforeEach(() => {
    page = new KeyholderAngularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to My First Angular App!!');
  });
});
