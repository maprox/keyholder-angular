import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Options } from '../password-generator/model';
import { Container, Folder, Secret } from './model';
import { StorageApiService } from './storage-api.service';

describe('StorageApiService', () => {
  let service: StorageApiService;
  let authService;
  let httpService;
  let containerCodecService;
  let passwordGeneratorService;
  let alertService;
  let options;
  let httpClientSubject;
  let getAuthEventSubject;
  let httpSpy;

  beforeEach(() => {
    localStorage.clear();

    httpClientSubject = new Subject<Object>();
    httpSpy = jasmine.createSpy().and.returnValue(httpClientSubject);
    httpService = {
      get: httpSpy,
      put: httpSpy
    };
    getAuthEventSubject = new Subject<Object>();
    authService = {
      getAuthEvent: jasmine.createSpy().and.returnValue(getAuthEventSubject),
    };
    containerCodecService = {
      encode: jasmine.createSpy(),
      decode: jasmine.createSpy()
    };
    alertService = {
      error: jasmine.createSpy()
    };
    options = new Options();
    passwordGeneratorService = {
      getOptions: jasmine.createSpy().and.returnValue(options),
      setOptions: jasmine.createSpy()
    };

    service = new StorageApiService(
      authService,
      httpService,
      containerCodecService,
      passwordGeneratorService,
      alertService
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save new storage with one URI-encoded layer', () => {
    const root = getRoot();
    const encryptedContainer = '{"format":"keyholder","v":2}';
    const container = new Container(root, options);
    containerCodecService.encode.and.returnValue(encryptedContainer);

    service.save(root);

    expect(passwordGeneratorService.getOptions).toHaveBeenCalled();
    expect(containerCodecService.encode).toHaveBeenCalledWith(JSON.stringify(container));
    expect(httpService.put).toHaveBeenCalledWith('/storage', {
      data: encodeURIComponent(encryptedContainer)
    });
    expect(localStorage.getItem('storage')).toEqual(null);

    httpClientSubject.next();
    expect(localStorage.getItem('storage')).toEqual(encodeURIComponent(encryptedContainer));

    localStorage.clear();
    httpClientSubject.error();
    expect(localStorage.getItem('storage')).toEqual(encodeURIComponent(encryptedContainer));
  });

  it('should save loaded storage', () => {
    const root = new Folder('root');
    const container = new Container(root, options);
    const encryptedContainer = '{"format":"keyholder","v":2}';

    service.load();
    httpClientSubject.next(encryptedContainer);
    containerCodecService.encode.and.returnValue(encryptedContainer);

    service.save(root);

    expect(containerCodecService.encode).toHaveBeenCalledWith(JSON.stringify(container));
    expect(httpService.put).toHaveBeenCalledWith('/storage', {
      data: encodeURIComponent(encryptedContainer)
    });
  });

  it('should migrate raw legacy storage to v2 on the next save', () => {
    const rawLegacy = 'U2FsdGVkX1legacy';
    const v2Container = '{"format":"keyholder","v":2,"data":"encrypted"}';
    const container = new Container(getRoot(), options);
    containerCodecService.decode.and.returnValue(JSON.stringify(container));
    containerCodecService.encode.and.returnValue(v2Container);

    service.load();
    httpClientSubject.next(rawLegacy);
    service.save(container.getStorage());

    expect(containerCodecService.decode).toHaveBeenCalledWith(rawLegacy);
    expect(httpService.put).toHaveBeenCalledWith('/storage', {
      data: encodeURIComponent(v2Container)
    });
  });

  it('should reject invalid server data without creating an empty container', () => {
    const onSuccess = jasmine.createSpy();
    const encryptedRoot = 'invalid-container';

    service.load().pipe(first()).subscribe(onSuccess);
    httpClientSubject.next(encryptedRoot);

    expect(containerCodecService.decode).toHaveBeenCalledWith(encryptedRoot);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(alertService.error).toHaveBeenCalledTimes(1);
    expect(passwordGeneratorService.setOptions).not.toHaveBeenCalled();
    expect(localStorage.getItem('storage')).toBeNull();
  });

  it('should reject an empty server response as invalid existing data', () => {
    const onSuccess = jasmine.createSpy();

    service.load().subscribe(onSuccess);
    httpClientSubject.next('');

    expect(onSuccess).not.toHaveBeenCalled();
    expect(alertService.error).toHaveBeenCalledTimes(1);
    expect(passwordGeneratorService.setOptions).not.toHaveBeenCalled();
  });

  it('should load successfully decrypted server data', () => {
    const onSuccess = jasmine.createSpy();
    const encryptedContainer = 'EnCr YPt=eeed!';
    const container = new Container(getRoot(), options);

    containerCodecService.decode.and.returnValue(JSON.stringify(container));
    service.load().subscribe(onSuccess);
    httpClientSubject.next(encryptedContainer);

    expect(containerCodecService.decode).toHaveBeenCalledWith(encryptedContainer);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(container);
  });

  it('should URI-decode localStorage data exactly once before decoding', () => {
    const onSuccess = jasmine.createSpy();
    const encryptedRoot = '{"format":"keyholder","v":2,"data":"encrypted"}';
    const container = new Container(getRoot(), options);

    localStorage.setItem('storage', encodeURIComponent(encryptedRoot));
    containerCodecService.decode.and.returnValue(JSON.stringify(container));
    service.load().subscribe(onSuccess);
    httpClientSubject.error();

    expect(containerCodecService.decode).toHaveBeenCalledWith(encryptedRoot);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(container);
  });

  it('should not initialize a container when the server is unavailable and there is no local copy', () => {
    const onSuccess = jasmine.createSpy();

    service.load().subscribe(onSuccess);
    httpClientSubject.error();

    expect(onSuccess).not.toHaveBeenCalled();
    expect(containerCodecService.decode).not.toHaveBeenCalled();
    expect(alertService.error).toHaveBeenCalledTimes(1);
    expect(passwordGeneratorService.setOptions).not.toHaveBeenCalled();
  });

  [null, undefined].forEach((absentValue) => {
    it(`should initialize a container after a successful ${absentValue} server response`, () => {
      const onSuccess = jasmine.createSpy();

      service.load().subscribe(onSuccess);
      httpClientSubject.next(absentValue);

      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith(new Container(new Folder('root'), options));
      expect(containerCodecService.decode).not.toHaveBeenCalled();
      expect(alertService.error).not.toHaveBeenCalled();
    });
  });

  it('should reject invalid localStorage data without replacing it', () => {
    const onSuccess = jasmine.createSpy();
    localStorage.setItem('storage', 'invalid-local-data');
    containerCodecService.decode.and.throwError('invalid');

    service.load().subscribe(onSuccess);
    httpClientSubject.error();

    expect(onSuccess).not.toHaveBeenCalled();
    expect(alertService.error).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('storage')).toBe('invalid-local-data');
    expect(passwordGeneratorService.setOptions).not.toHaveBeenCalled();
  });

  it('should report malformed URI encoding from the server', () => {
    const onSuccess = jasmine.createSpy();

    service.load().subscribe(onSuccess);
    httpClientSubject.next('%ZZ');

    expect(onSuccess).not.toHaveBeenCalled();
    expect(alertService.error).toHaveBeenCalledTimes(1);
    expect(containerCodecService.decode).not.toHaveBeenCalled();
  });

  it('should report malformed URI encoding from localStorage', () => {
    const onSuccess = jasmine.createSpy();
    localStorage.setItem('storage', '%ZZ');

    service.load().subscribe(onSuccess);
    httpClientSubject.error();

    expect(onSuccess).not.toHaveBeenCalled();
    expect(alertService.error).toHaveBeenCalledTimes(1);
    expect(containerCodecService.decode).not.toHaveBeenCalled();
  });

  it('should reject decrypted values that are not complete containers', () => {
    const invalidPlaintexts = [
      '{}',
      '"text"',
      '42',
      '[]',
      '{"_type":"Container"}',
      '{"_type":"Container","storage":{},"options":{}}',
    ];

    invalidPlaintexts.forEach((plaintext) => {
      containerCodecService.decode.and.returnValue(plaintext);
      expect(service.loadContainer('encrypted')).toBeNull();
    });
  });

  it('should not expose or overwrite storage after logout followed by invalid data', () => {
    const initialContainer = new Container(getRoot(), options);
    containerCodecService.decode.and.returnValue(JSON.stringify(initialContainer));
    service.load();
    httpClientSubject.next('valid-v2');

    getAuthEventSubject.next(false);
    containerCodecService.decode.and.throwError('invalid');
    const invalidSubject = new Subject<Object>();
    httpService.get = jasmine.createSpy().and.returnValue(invalidSubject);
    const afterLogout = jasmine.createSpy();
    service.load().subscribe(afterLogout);
    invalidSubject.next('invalid-v2');

    expect(afterLogout).not.toHaveBeenCalled();
    expect(localStorage.getItem('storage')).toBeNull();
    expect(alertService.error).toHaveBeenCalledTimes(1);
  });

  it('should try to reload storage from server when logged out', (done: DoneFn) => {
    const onSuccess = jasmine.createSpy();
    const container = new Container(getRoot(), options);

    service.load().pipe(first()).subscribe(onSuccess);
    containerCodecService.decode.and.returnValue(JSON.stringify(container));
    httpClientSubject.next('encrypted');
    expect(onSuccess).toHaveBeenCalledTimes(1);

    httpService.get = jasmine.createSpy().and.returnValue({subscribe: () => {}});
    const onSuccess2 = jasmine.createSpy();
    service.load().pipe(first()).subscribe(onSuccess2);
    setTimeout(() => {
      expect(httpService.get).toHaveBeenCalledTimes(0);
      expect(onSuccess2).toHaveBeenCalledTimes(1);

      getAuthEventSubject.next(true);
      service.load();
      expect(httpService.get).toHaveBeenCalledTimes(0);

      getAuthEventSubject.next(false);
      service.load();
      expect(httpService.get).toHaveBeenCalledTimes(1);
      done();
    });
  });

  function getRoot(): Folder {
    const root = new Folder();
    (root.add(new Folder('test')) as Folder).add(new Secret(
      'secret',
      'super-secret!11'
    ));

    return root;
  }
});
