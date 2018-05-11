import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Alert, AlertType } from './model';

@Injectable()
export class AlertService {
    private subject = new Subject<Alert>();

    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, ttl: number = null) {
        this.alert(AlertType.Success, message, ttl);
    }

    error(message: string, ttl: number = null) {
        this.alert(AlertType.Error, message, ttl);
    }

    info(message: string, ttl: number = null) {
        this.alert(AlertType.Info, message, ttl);
    }

    warn(message: string, ttl: number = null) {
        this.alert(AlertType.Warning, message, ttl);
    }

    alert(type: AlertType, message: string, ttl: number = null) {
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
