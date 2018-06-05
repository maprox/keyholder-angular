import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

import { EncryptingService } from '../encrypting';
import { HttpService } from '../http';
import { SerializerService } from '../serializer';
import { Secret, Folder } from './model';

@Injectable()
export class StorageApiService {
    private storageKey = 'storage';
    private subject = new Subject<Object>();

    constructor(
        private http: HttpService,
        private encrypting: EncryptingService
    ) { }

    save(root: Folder) {
        const input = {
            data: encodeURIComponent(this.encrypting.encrypt(JSON.stringify(root)))
        };

        const copyToLocalStorage = () => {
            localStorage.setItem(this.storageKey, input.data);
        };

        this.http.put('/storage', input).subscribe(
            copyToLocalStorage,
            copyToLocalStorage
        );
    }

    load(): Observable<any> {
        this.http.get('/storage', {responseType: 'text'}).subscribe(
            (data) => this.loadData(decodeURIComponent(data)),
            () => this.loadData(localStorage.getItem(this.storageKey))
        );
        return this.subject.asObservable();
    }

    loadData(data: string) {
        const input = this.encrypting.decrypt(data);
        if (input) {
            this.subject.next(JSON.parse(input, SerializerService.getReviver({
                'Secret': Secret,
                'Folder': Folder
            })));
        }
    }
}
