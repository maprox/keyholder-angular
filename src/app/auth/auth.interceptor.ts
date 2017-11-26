import { Injectable, Injector } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Get the auth header from the service.
        const auth = this.injector.get(AuthService);
        const authHeader = auth.getAuthorizationHeader();
        if (authHeader) {
            // Clone the request to add the new header.
            req = req.clone({
                headers: req.headers.set('Authorization', authHeader)
            });
        }

        return next.handle(req);
    }
}
