import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

import { AlertService } from '../alert';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
    private subject = new Subject<Object>();
    private session = null;

    constructor(
        private http: HttpClient,
        private alert: AlertService
    ) { }

    isLoggedIn() {
        return !!this.session;
    }

    isLoggedInEvent(): Observable<any> {
        return this.subject.asObservable();
    }

    logIn(username: string, password: string) {
        const url = 'http://localhost:3000/api/sign_in';
        const body = new URLSearchParams();
        body.set('login', username);
        body.set('secret', password);

        const options = {
            headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
        };

        this.http.post(url, body.toString(), options).subscribe(
            data => {
                this.session = data;
                this.subject.next(this.session);
            },
            (err: HttpErrorResponse) => {
                this.session = null;
                this.subject.next();
                if (err.error instanceof Error) {
                    // A client-side or network error occurred. Handle it accordingly.
                    this.alert.error('Unknown error occurred, please try again later.');
                } else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong,
                    this.alert.error(`Backend returned code ${err.status}, body was: ${err.error}`);
                }
            }
        );
    }

    logOut() {
        this.session = null;
        this.subject.next();
    }
}
