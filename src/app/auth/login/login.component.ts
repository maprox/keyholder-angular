import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { User } from '../model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    username: string;
    password: string;
    passwordType = 'password';
    returnUrl: string;
    loading: boolean;
    signUp: boolean;

    constructor(
        private auth: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        if (this.auth.isLoggedIn()) {
            this.router.navigate(['/storage']);
            return;
        }
        this.route.data.subscribe((data) => this.signUp = data.signUp);
        this.auth.getAuthEvent().subscribe((isLoggedIn) => {
            this.loading = false;
            if (isLoggedIn) {
                this.router.navigate([this.returnUrl || '/']);
            }
        });
    }

    onSubmit() {
        const user = new User(this.username, this.password);
        // get return url from route parameters or default to '/'
        this.returnUrl = decodeURIComponent(this.route.snapshot.queryParams.returnUrl || '/');
        this.loading = true;
        if (this.signUp) {
            this.auth.signUp(user);
        } else {
            this.auth.signIn(user);
        }
    }

    togglePasswordVisibility() {
        this.passwordType = (this.passwordType === 'password') ? 'text' : 'password';
    }
}
