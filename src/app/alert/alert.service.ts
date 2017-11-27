import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { Alert, AlertType } from './model';

@Injectable()
export class AlertService {
    private subject = new Subject<Alert>();
    private keepAfterRouteChange = false;

    constructor(private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert messages
                    this.clear();
                }
            }
        });
    }

    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, ttl: number = null, keepAfterRouteChange = false) {
        this.alert(AlertType.Success, message, ttl, keepAfterRouteChange);
    }

    error(message: string, ttl: number = null, keepAfterRouteChange = false) {
        this.alert(AlertType.Error, message, ttl, keepAfterRouteChange);
    }

    info(message: string, ttl: number = null, keepAfterRouteChange = false) {
        this.alert(AlertType.Info, message, ttl, keepAfterRouteChange);
    }

    warn(message: string, ttl: number = null, keepAfterRouteChange = false) {
        this.alert(AlertType.Warning, message, ttl, keepAfterRouteChange);
    }

    alert(type: AlertType, message: string, ttl: number = null, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next(<Alert>{
            type: type,
            message: message,
            ttl: ttl
        });
    }

    clear() {
        // clear alerts
        this.subject.next();
    }
}
