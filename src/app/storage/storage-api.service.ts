import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../auth';

import { EncryptingService } from '../encrypting';
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
    private encrypting: EncryptingService,
    private passwordGenerator: PasswordGeneratorService,
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
        (data) => this.loadData(decodeURIComponent(data)),
        () => this.loadData(localStorage.getItem(this.storageKey))
      );
    } else {
      setTimeout(() => this.subject.next(this.container));
    }
    return this.subject.asObservable();
  }

  loadContainer(data: string): Container {
    let container: Container = null;
    try {
      const input = this.encrypting.decrypt(data);
      if (input) {
        container = JSON.parse(input, SerializerService.getReviver({
          'Container': Container,
          'Folder': Folder,
          'Options': Options,
          'Secret': Secret,
        }));
      }
    } catch (e) {
      // todo do something here?
    }
    return container;
  }

  private loadData(data: string) {
    try {
      this.container = this.loadContainer(data);
      if (!this.container) {
        // initial container (right after signup)
        this.container = new Container(
          new Folder('root'),
          this.passwordGenerator.getOptions()
        );
      }
      this.passwordGenerator.setOptions(this.container.getOptions());
      this.subject.next(this.container);
    } catch (e) {
      // todo do something here?
    }
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
    return encodeURIComponent(this.encrypting.encrypt(this.container.serialize()));
  }
}
