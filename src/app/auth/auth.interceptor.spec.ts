import { HttpHandler, HttpRequest } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('AuthInterceptor', () => {
    let authServiceStub;

    beforeEach(() => {
        // mock services
        authServiceStub = {
            getAuthorizationHeader: jasmine.createSpy()
        };

        TestBed.configureTestingModule({
            providers: [
                AuthInterceptor,
                {
                    provide: AuthService,
                    useValue: authServiceStub
                }
            ]
        });
    });

    it('should not modify headers', inject([AuthInterceptor], (interceptor: AuthInterceptor) => {
        const request = new HttpRequest<any>('GET', '/some-url');
        const next = <HttpHandler> {handle: null};
        const nextSpy = spyOn(next, 'handle');

        expect(interceptor.intercept(request, next)).toEqual(undefined);

        expect(authServiceStub.getAuthorizationHeader).toHaveBeenCalled();
        expect(nextSpy).toHaveBeenCalledWith(request);
    }));

    it('should modify headers', inject([AuthInterceptor], (interceptor: AuthInterceptor) => {
        const request = new HttpRequest<any>('GET', '/some-url');
        const next = <HttpHandler> {handle: null};
        const nextSpy = spyOn(next, 'handle');

        const authHeader = 'Bearer 30404930';
        authServiceStub.getAuthorizationHeader.and.returnValue(authHeader);

        expect(interceptor.intercept(request, next)).toEqual(undefined);

        expect(authServiceStub.getAuthorizationHeader).toHaveBeenCalled();
        expect(nextSpy).toHaveBeenCalled();

        // args passed to router.navigateByUrl()
        const updatedRequest = nextSpy.calls.first().args[0];
        expect(updatedRequest.headers.get('Authorization')).toContain(authHeader);
    }));
});
