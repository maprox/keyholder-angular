import { inject, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
    let authServiceStub,
        routerStub;

    beforeEach(() => {
        // mock services
        authServiceStub = {
            getSession: jasmine.createSpy()
        };
        routerStub = {
            navigate: jasmine.createSpy()
        };

        TestBed.configureTestingModule({
            providers: [
                AuthGuard,
                {
                    provide: AuthService,
                    useValue: authServiceStub
                }, {
                    provide: Router,
                    useValue: routerStub
                }
            ]
        });
    });

    it('can not activate when not logged in', inject([AuthGuard], (guard: AuthGuard) => {
        const snapshot = <ActivatedRouteSnapshot>{};
        const state = <RouterStateSnapshot>{url: 'some-url'};

        expect(guard.canActivate(snapshot, state)).toBeFalsy();
        expect(authServiceStub.getSession).toHaveBeenCalled();
        expect(routerStub.navigate).toHaveBeenCalledWith(['/login'], {
            queryParams: {
                returnUrl: state.url
            }
        });
    }));

    it('can activate when logged in', inject([AuthGuard], (guard: AuthGuard) => {
        const snapshot = <ActivatedRouteSnapshot>{};
        const state = <RouterStateSnapshot>{url: 'some-url'};

        authServiceStub.getSession.and.returnValue({some: 'session_data'});

        expect(guard.canActivate(snapshot, state)).toBeTruthy();
        expect(authServiceStub.getSession).toHaveBeenCalled();
        expect(routerStub.navigate).toHaveBeenCalledTimes(0);
    }));
});
