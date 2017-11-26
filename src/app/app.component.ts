import { Component, OnInit } from '@angular/core';

import { StorageService } from './storage';
import { AuthService } from './auth';

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
