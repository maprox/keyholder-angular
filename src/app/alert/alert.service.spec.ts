import { inject, TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { Alert, AlertType } from './model';

describe('AlertService', () => {
  let service: AlertService;
  let alert: Alert;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlertService,
      ],
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

    service.alert(AlertType.Success, message);
    expect(alert).toEqual({
      type: AlertType.Success,
      message: message,
      ttl: null,
    });

    service.success(message);
    expect(alert).toEqual({
      type: AlertType.Success,
      message: message,
      ttl: null,
    });

    service.success(message, 101);
    expect(alert).toEqual({
      type: AlertType.Success,
      message: message,
      ttl: 101,
    });

    service.error(message);
    expect(alert).toEqual({
      type: AlertType.Error,
      message: message,
      ttl: null,
    });

    service.error(message, 102);
    expect(alert).toEqual({
      type: AlertType.Error,
      message: message,
      ttl: 102,
    });

    service.warn(message);
    expect(alert).toEqual({
      type: AlertType.Warning,
      message: message,
      ttl: null,
    });

    service.warn(message, 100);
    expect(alert).toEqual({
      type: AlertType.Warning,
      message: message,
      ttl: 100,
    });

    service.info(message);
    expect(alert).toEqual({
      type: AlertType.Info,
      message: message,
      ttl: null,
    });

    service.info(message, 200);
    expect(alert).toEqual({
      type: AlertType.Info,
      message: message,
      ttl: 200,
    });
  });

  it('should clear alerts by sending undefined', () => {
    const message = 'Hello virtual world!';

    service.success(message);
    expect(alert).toEqual({
      type: AlertType.Success,
      message: message,
      ttl: null,
    });

    service.clear();
    expect(alert).toBeUndefined();
  });
});
