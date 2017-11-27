import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { AlertService } from '../alert';
import { HttpService } from '../http.service';
import { Session, User } from './model';

@Injectable()
export class AuthService {
    private subject = new Subject<Object>();
    private session: Session;

    constructor(
        private http: HttpService,
        private alert: AlertService
    ) { }

    getSession(): Session {
        return this.session;
    }

    isLoggedIn(): Observable<any> {
        return this.subject.asObservable();
    }

    logIn(user: User) {
        const body = {
            login: user.getUsername(),
            secret: user.getPassword()
        };

        this.http.post('/sign_in', body).subscribe(
            data => {
                this.session = new Session(data.token, data.data);
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

    getAuthorizationHeader(): string {
        const session = this.getSession();
        return session ? 'Bearer ' + session.getToken() : '';
    }
}
