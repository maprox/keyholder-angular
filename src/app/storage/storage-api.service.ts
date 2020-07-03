import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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
    private http: HttpService,
    private encrypting: EncryptingService,
    private passwordGenerator: PasswordGeneratorService
  ) { }

  getEncryptedStorageContainer(root: Folder): string {
    const options = this.passwordGenerator.getOptions();
    if (!this.container) {
      this.container = new Container(root, options);
    } else {
      this.container.setStorage(root);
      this.container.setOptions(options);
    }
    return encodeURIComponent(this.encrypting.encrypt(JSON.stringify(this.container)));
  }

  save(root: Folder): Observable<any> {
    const input = {
      data: this.getEncryptedStorageContainer(root)
    };

    const copyToLocalStorage = () => {
      localStorage.setItem(this.storageKey, input.data);
    };

    const request = this.http.put('/storage', input);
    request.subscribe(copyToLocalStorage, copyToLocalStorage);

    return request;
  }

  load(): Observable<any> {
    if (!this.container) {
      this.http.get('/storage', {responseType: 'text'}).subscribe(
        (data) => this.loadData(decodeURIComponent(data)),
        () => this.loadData(localStorage.getItem(this.storageKey))
      );
    } else {
      this.subject.next(this.container);
    }
    return this.subject.asObservable();
  }

  loadData(data: string): Container {
    try {
      const input = this.encrypting.decrypt(data);
      if (input) {
        this.container = JSON.parse(input, SerializerService.getReviver({
          'Container': Container,
          'Folder': Folder,
          'Options': Options,
          'Secret': Secret
        }));

        if (this.container instanceof Folder) {
          // legacy version, to be removed after deploy
          this.container = new Container(
            this.container,
            this.passwordGenerator.getOptions()
          );
        }

        this.passwordGenerator.setOptions(this.container.getOptions());
        this.subject.next(this.container);
      }
    } catch (e) {
      // todo do something here?
    }
    return this.container;
  }
}
