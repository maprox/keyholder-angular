import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-demo-warning-bar',
    templateUrl: './demo-warning-bar.component.html',
    styleUrls: ['./demo-warning-bar.component.scss']
})
export class DemoWarningBarComponent {
    isDemo = environment.demo;
}
