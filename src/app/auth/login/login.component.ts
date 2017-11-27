import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { User } from '../model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    username: string;
    password: string;
    returnUrl: string;
    loading: boolean;

    constructor(
        private auth: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        if (this.auth.getSession()) {
            this.router.navigate(['/storage']);
            return;
        }
        this.auth.isLoggedIn().subscribe((isLoggedIn) => {
            this.loading = false;
            if (isLoggedIn) {
                this.router.navigate([this.returnUrl || '/']);
            }
        });
    }

    onSubmit() {
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
        this.loading = true;
        this.auth.logIn(new User(this.username, this.password));
    }
}
