import { FileIoService } from './file-io.service';

describe('FileIoService', () => {
  it('reports malformed URI encoding through the observable error channel', (done: DoneFn) => {
    const service = new FileIoService();
    const success = jasmine.createSpy('success');

    service.readFile(new File(['%ZZ'], 'invalid.kh2')).subscribe(success, (error) => {
      expect(success).not.toHaveBeenCalled();
      expect(error instanceof URIError).toBeTrue();
      done();
    });
  });
});
