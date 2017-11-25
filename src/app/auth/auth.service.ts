import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';

import { AlertService } from '../alert';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {

    constructor(
        private http: HttpClient,
        private alert: AlertService
    ) { }

    isLoggedIn() {
        return false;
    }

    logIn(username: string, password: string): Observable<Object> {
        const url = 'http://localhost:3000/api/sign_in';
        const body = new URLSearchParams();
        body.set('login', username);
        body.set('secret', password);

        const options = {
            headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
        };

        const request = this.http.post(url, body.toString(), options);

        request.subscribe(
            data => {
                // Read the result field from the JSON response.
                console.log(data);
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
            }
        );

        return request;
    }

}
