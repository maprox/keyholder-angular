import { Component, OnInit } from '@angular/core';

import { AlertService } from './alert.service';
import { Alert, AlertType } from './model';

const alertStyles = {};
alertStyles[AlertType.Success] = 'alert-success';
alertStyles[AlertType.Error] = 'alert-danger';
alertStyles[AlertType.Info] = 'alert-info';
alertStyles[AlertType.Warning] = 'alert-warning';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
    alerts: Alert[] = [];

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getAlert().subscribe((alert: Alert) => {
            if (!alert) {
                // clear alerts when an empty alert is received
                this.alerts = [];
                return;
            }

            // add alert to array
            this.alerts.push(alert);

            // remove alert after 5 seconds
            if (alert.ttl) {
                setTimeout(() => this.removeAlert(alert), alert.ttl);
            }
        });
    }

    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(x => x !== alert);
    }

    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }

        // return css class based on alert type
        return alertStyles[alert.type];
    }
}
