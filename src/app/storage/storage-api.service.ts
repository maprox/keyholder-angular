import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../auth';
import { AlertService } from '../alert';

import { ContainerCodecService } from '../encrypting';
import { HttpService } from '../http';
import { PasswordGeneratorService } from '../password-generator';
import { Options } from '../password-generator/model';
import { SerializerService } from '../serializer';
import { Container, Folder, Secret } from './model';

@Injectable()
export class StorageApiService {
  private storageKey = 'storage';
  private subject = new Subject<Object>();
  private container: Container;

  constructor(
    private auth: AuthService,
    private http: HttpService,
    private codec: ContainerCodecService,
    private passwordGenerator: PasswordGeneratorService,
    private alert: AlertService,
  ) {
    auth.getAuthEvent().subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        delete this.container;
      }
    });
  }

  load(): Observable<any> {
    if (!this.container) {
      this.http.get('/storage', {responseType: 'text'}).subscribe(
        (data) => this.loadTransportData(data),
        () => {
          const data = localStorage.getItem(this.storageKey);
          if (data === null) {
            this.failLoad();
            return;
          }
          this.loadTransportData(data);
        }
      );
    } else {
      setTimeout(() => this.subject.next(this.container));
    }
    return this.subject.asObservable();
  }

  loadContainer(data: string): Container {
    let container: Container = null;
    try {
      const input = this.codec.decode(data);
      if (input) {
        const parsed = JSON.parse(input, SerializerService.getReviver({
          'Container': Container,
          'Folder': Folder,
          'Options': Options,
          'Secret': Secret,
        }));
        if (parsed instanceof Container
          && parsed.getStorage() instanceof Folder
          && parsed.getOptions() instanceof Options) {
          container = parsed;
        }
      }
    } catch {
      return null;
    }
    return container;
  }

  private loadTransportData(data: string) {
    try {
      const decoded = data === null || data === undefined ? data : decodeURIComponent(data);
      this.loadData(decoded);
    } catch {
      this.failLoad();
    }
  }

  private failLoad() {
    this.alert.error('Unable to load storage: invalid or unsupported container.');
  }

  private loadData(data: string) {
    let container: Container;
    if (data === null || data === undefined) {
      container = new Container(
        new Folder('root'),
        this.passwordGenerator.getOptions()
      );
    } else {
      container = this.loadContainer(data);
      if (!container) {
        this.failLoad();
        return;
      }
    }

    this.container = container;
    this.passwordGenerator.setOptions(container.getOptions());
    this.subject.next(container);
  }

  save(root: Folder, options?: Options): Observable<any> {
    const defaultOptions = this.passwordGenerator.getOptions();
    if (!this.container) {
      this.container = new Container(root, options || defaultOptions);
      this.subject.next(this.container);
    } else {
      this.container.setStorage(root);
      this.container.setOptions(options || defaultOptions);
    }

    const input = {
      data: this.getEncryptedContainer(),
    };

    const copyToLocalStorage = () => {
      localStorage.setItem(this.storageKey, input.data);
    };

    const request = this.http.put('/storage', input);
    request.subscribe(copyToLocalStorage, copyToLocalStorage);

    return request;
  }

  getEncryptedContainer(): string {
    return encodeURIComponent(this.codec.encode(this.container.serialize()));
  }
}
