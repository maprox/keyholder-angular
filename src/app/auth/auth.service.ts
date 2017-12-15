import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { AlertService } from '../alert';
import { EncryptingService } from '../encrypting';
import { HttpService } from '../http';
import { SerializerService } from '../serializer';
import { Session, User } from './model';

@Injectable()
export class AuthService {
    private subject = new Subject<Object>();
    private session: Session;

    constructor(
        private http: HttpService,
        private alert: AlertService,
        private encrypting: EncryptingService
    ) { }

    getSession(): Session {
        if (this.session === undefined) {
            this.session = JSON.parse(
                sessionStorage.getItem('session'),
                SerializerService.getReviver({'Session': Session})
            );
            this.subject.next(this.session);
        }
        return this.session;
    }

    isLoggedIn(): boolean {
        return !!this.getSession();
    }

    getAuthEvent(): Observable<any> {
        return this.subject.asObservable();
    }

    request(user: User, url: string) {
        this.encrypting.setUser(user);
        const body = {
            login: user.getUsername(),
            secret: this.encrypting.getSecret()
        };

        this.http.post(url, body).subscribe(
            data => {
                this.session = new Session(data.token, data.data);
                this.subject.next(this.session);
                sessionStorage.setItem('session', JSON.stringify(this.session));
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

    signIn(user: User) {
        return this.request(user, '/sign_in');
    }

    signUp(user: User) {
        return this.request(user, '/sign_up');
    }

    logOut() {
        this.encrypting.setUser(null);
        this.session = null;
        this.subject.next();
    }

    getAuthorizationHeader(): string {
        const session = this.getSession();
        return session ? 'Bearer ' + session.getToken() : '';
    }
}
