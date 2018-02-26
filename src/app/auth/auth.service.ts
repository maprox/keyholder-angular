import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

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
        private encrypting: EncryptingService,
        private router: Router
    ) {
        http.getConnectionEvent().subscribe((res) => {
            if (res instanceof HttpErrorResponse && res.status === 403) {
                router.navigate(['/logout']);
            }
        });
    }

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
            () => {
                this.logOut();
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
