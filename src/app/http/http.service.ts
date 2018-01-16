import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { environment } from '../../environments/environment';
import { AlertService } from '../alert';

@Injectable()
export class HttpService {
    private subject = new Subject<Object>();
    private isConnected: boolean;

    /**
     *
     * @param contents
     * @returns {string}
     */
    private static getContents(contents: any): string {
        if (typeof contents === 'string') {
            return contents;
        }

        const body = new URLSearchParams();
        for (const key in contents) {
            if (contents.hasOwnProperty(key)) {
                body.set(key, contents[key]);
            }
        }

        return body.toString();
    }

    /**
     *
     * @param options
     * @returns {any}
     */
    private static getOptions(options: any): any {
        options = Object.assign({}, options);

        if (!options.headers || !(options.headers instanceof HttpHeaders)) {
            options.headers = new HttpHeaders();
        }

        const headers = options.headers;
        if (!headers.has('Content-Type')) {
            options.headers = headers.set(
                'Content-Type',
                'application/x-www-form-urlencoded'
            );
        }

        return options;
    }

    constructor(
        public http: HttpClient,
        private alert: AlertService
    ) { }

    /**
     *
     * @param {string} url
     * @returns {string}
     */
    private getApiUrl(url: string) {
        return environment.apiBase + url;
    }

    /**
     *
     * @param {string} url
     * @param contents
     * @param options
     * @returns {Observable<any>}
     */
    post(url: string, contents: any, options?: any): Observable<any> {
        const response = new Subject<Object>();

        this.http.post(
            this.getApiUrl(url),
            HttpService.getContents(contents),
            HttpService.getOptions(options)
        ).subscribe(
            this.getSuccessHandler(response),
            this.getFailureHandler(response)
        );

        return response.asObservable();
    }

    /**
     *
     * @param {string} url
     * @param contents
     * @param options
     * @returns {Observable<any>}
     */
    put(url: string, contents: any, options?: any): Observable<any> {
        const response = new Subject<Object>();

        this.http.put(
            this.getApiUrl(url),
            HttpService.getContents(contents),
            HttpService.getOptions(options)
        ).subscribe(
            this.getSuccessHandler(response),
            this.getFailureHandler(response)
        );

        return response.asObservable();
    }

    /**
     *
     * @param {string} url
     * @param options
     * @returns {Observable<any>}
     */
    get(url: string, options?: any): Observable<any> {
        const response = new Subject<Object>();

        this.http.get(
            this.getApiUrl(url),
            HttpService.getOptions(options)
        ).subscribe(
            this.getSuccessHandler(response),
            this.getFailureHandler(response)
        );

        return response.asObservable();
    }

    getSuccessHandler(response: Subject<Object>) {
        return (data: any) => {
            this.setConnected(true);
            response.next(data);
            response.complete();
        }
    }

    getFailureHandler(response: Subject<Object>) {
        return (err: HttpErrorResponse) => {
            if (this.isConnected === false) {
                return;
            }
            if (err.error instanceof Error) {
                // A client-side or network error occurred. Handle it accordingly.
                this.alert.error('Unknown error occurred, please try again later.');
            } else {
                // The backend returned an unsuccessful response code.
                // The response body may contain clues as to what went wrong,
                if (!err.status) {
                    this.alert.error(`Network error, please check your connection.`);
                    this.setConnected(false);
                } else {
                    this.alert.error(`Backend returned code ${err.status}, body was: ${err.error}`);
                }
            }
            response.error(err);
            response.complete();
        };
    }

    private setConnected(isConnected: boolean) {
        if (this.isConnected !== isConnected) {
            this.isConnected = isConnected;
            this.subject.next(this.isConnected);
        }
    }

    isOffline(): boolean {
        return !this.isConnected;
    }

    getConnectionEvent(): Observable<any> {
        return this.subject.asObservable();
    }
}
