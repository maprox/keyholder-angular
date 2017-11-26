import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    email: string;
    password: string;
    returnUrl: string;
    loading: boolean;

    constructor(
        private auth: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    onSubmit() {
        this.loading = true;
        this.auth.logIn(this.email, this.password).subscribe(
            () => this.router.navigate([this.returnUrl]),
            (err: HttpErrorResponse) => {
                this.loading = false;
            }
        );
    }
}
