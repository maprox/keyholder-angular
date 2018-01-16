import { Component } from '@angular/core';
import { AuthService } from './auth';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    displayMenu: boolean;

    constructor(private auth: AuthService) {
        auth.getAuthEvent().subscribe((isLoggedIn) => {
            // we have to use timeout here because of
            // ExpressionChangedAfterItHasBeenCheckedError
            setTimeout(() => {
                this.displayMenu = isLoggedIn;
            });
        });
    }
}
