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

    constructor(
        private http: HttpService,
        private encrypting: EncryptingService,
        private passwordGenerator: PasswordGeneratorService
    ) { }

    getEncryptedStorageContainer(root: Folder): string {
        const options = this.passwordGenerator.getOptions();
        const container = new Container(root, options);
        return encodeURIComponent(this.encrypting.encrypt(JSON.stringify(container)));
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
        this.http.get('/storage', {responseType: 'text'}).subscribe(
            (data) => this.loadData(decodeURIComponent(data)),
            () => this.loadData(localStorage.getItem(this.storageKey))
        );
        return this.subject.asObservable();
    }

    loadData(data: string): Container {
        let container: Container = null;
        try {
            const input = this.encrypting.decrypt(data);
            if (input) {
                container = JSON.parse(input, SerializerService.getReviver({
                    'Container': Container,
                    'Folder': Folder,
                    'Options': Options,
                    'Secret': Secret
                }));

                if (container instanceof Folder) {
                    // legacy version, to be removed after deploy
                    container = new Container(container, this.passwordGenerator.getOptions());
                }

                this.passwordGenerator.setOptions(container.getOptions());
                this.subject.next(container);
            }
        } catch (e) {
            // todo do something here?
        }
        return container;
    }
}
