import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

import { AlertService } from '../alert';
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
        private alert: AlertService,
        private encrypting: EncryptingService
    ) { }

    save(root: Folder) {
        const input = {
            data: this.encrypting.encrypt(JSON.stringify(root))
        };

        this.http.put('/storage', input).subscribe(
            () => {},
            () => localStorage.setItem(this.storageKey, input.data)
        );
    }

    load(): Observable<any> {
        this.http.get('/storage', {responseType: 'text'}).subscribe(
            (data) => this.loadData(data),
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
