import { Component } from '@angular/core';
import { AuthService } from './auth';

import { StorageService } from './storage';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    displayMenu: boolean;

    constructor(
        private storage: StorageService,
        private auth: AuthService
    ) {
        storage.load();
        auth.isLoggedIn().subscribe((isLoggedIn) => {
            // we have to use timeout here because of
            // ExpressionChangedAfterItHasBeenCheckedError
            setTimeout(() => {
                this.displayMenu = isLoggedIn;
            });
        });
    }
}
