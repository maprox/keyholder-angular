import { Component } from '@angular/core';

import { StorageService } from './storage';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(service: StorageService) {
        service.load();
    }
}
