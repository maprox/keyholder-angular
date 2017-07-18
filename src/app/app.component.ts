import { Component } from '@angular/core';
import { StorageService } from './storage/storage.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'My First Angular App';

    constructor(service: StorageService) {
        service.load();
    }
}
