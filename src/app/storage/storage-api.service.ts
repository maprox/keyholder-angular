import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { AlertService } from '../alert';
import { EncryptingService } from '../encrypting';
import { HttpService } from '../http.service';
import { SerializerService } from '../serializer';
import * as ItemType from './model';
import { Folder } from './model';

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

        // localStorage.setItem(this.storageKey, data);
        this.http.put('/storage', input).subscribe(
            data => {
                // what should we do?
            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    // A client-side or network error occurred. Handle it accordingly.
                    this.alert.error('Unknown error occurred, please try again later.');
                } else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    this.alert.error(`Backend returned code ${err.status}, body was: ${err.error}`);
                }
            });
    }

    load(): Observable<any> {
        this.http.get('/storage', {responseType: 'text'}).subscribe(
            data => {
                // const input = localStorage.getItem(this.storageKey);
                const input = this.encrypting.decrypt(data);
                if (input) {
                    this.subject.next(JSON.parse(input, SerializerService.getReviver(ItemType)));
                }
            },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    // A client-side or network error occurred. Handle it accordingly.
                    this.alert.error('Unknown error occurred, please try again later.');
                } else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    this.alert.error(`Backend returned code ${err.status}, body was: ${err.error}`);
                }
            });
        return this.subject.asObservable();
    }
}
