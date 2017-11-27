import { Component } from '@angular/core';
import { AuthService } from './auth';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    displayMenu: boolean;

    constructor(private auth: AuthService) {
        auth.isLoggedIn().subscribe((isLoggedIn) => {
            // we have to use timeout here because of
            // ExpressionChangedAfterItHasBeenCheckedError
            setTimeout(() => {
                this.displayMenu = isLoggedIn;
            });
        });
    }
}
