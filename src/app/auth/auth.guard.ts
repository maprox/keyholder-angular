import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard  {
    constructor(
        private router: Router,
        private auth: AuthService
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.auth.getSession()) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], {
            queryParams: {
                returnUrl: state.url
            }
        });
        return false;
    }
}
