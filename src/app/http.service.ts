import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService {
    apiBase = 'http://localhost:3000/api';

    constructor(public http: HttpClient) { }

    /**
     *
     * @param {string} url
     * @returns {string}
     */
    private getApiUrl(url: string) {
        return this.apiBase + url;
    }

    /**
     *
     * @param contents
     * @returns {string}
     */
    private getContents(contents: any): string {
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
    private getOptions(options: any): any {
        options = options ? options.clone() : {};

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

    /**
     *
     * @param {string} url
     * @param contents
     * @param options
     * @returns {Observable<any>}
     */
    post(url: string, contents: any, options?: any): Observable<any> {
        return this.http.post(
            this.getApiUrl(url),
            this.getContents(contents),
            this.getOptions(options)
        );
    }

    /**
     *
     * @param {string} url
     * @param contents
     * @param options
     * @returns {Observable<any>}
     */
    put(url: string, contents: any, options?: any): Observable<any> {
        return this.http.put(
            this.getApiUrl(url),
            this.getContents(contents),
            this.getOptions(options)
        );
    }

    /**
     *
     * @param {string} url
     * @param options
     * @returns {Observable<any>}
     */
    get(url: string, options?: any): Observable<any> {
        return this.http.get(
            this.getApiUrl(url),
            this.getOptions(options)
        );
    }
}
