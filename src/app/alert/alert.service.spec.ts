import { inject, TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { Alert, AlertType } from './model';

describe('AlertService', () => {
    let service: AlertService;
    let alert: Alert;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AlertService
            ]
        });
    });

    beforeEach(inject([AlertService], (alertService: AlertService) => {
        alert = null;
        service = alertService;
        service.getAlert().subscribe((message) => {
            alert = message;
        });
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should send alerts', () => {
        const message = 'Hello virtual world!';

        service.success(message);
        expect(alert).toEqual({
            type: AlertType.Success,
            message: message,
            ttl: null
        });

        service.error(message);
        expect(alert).toEqual({
            type: AlertType.Error,
            message: message,
            ttl: null
        });

        service.warn(message);
        expect(alert).toEqual({
            type: AlertType.Warning,
            message: message,
            ttl: null
        });

        service.info(message, 200);
        expect(alert).toEqual({
            type: AlertType.Info,
            message: message,
            ttl: 200
        });
    });

    it('should clear alerts by sending undefined', () => {
        const message = 'Hello virtual world!';

        service.success(message);
        expect(alert).toEqual({
            type: AlertType.Success,
            message: message,
            ttl: null
        });

        service.clear();
        expect(alert).toBeUndefined();
    });
});
