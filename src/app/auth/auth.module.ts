import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

import { LoginComponent } from './login';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
    imports: [
        AuthRoutingModule,
        CommonModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [
        AuthService,
        AuthGuard
    ],
    declarations: [
        LoginComponent
    ],
    exports: [
        LoginComponent
    ]
})
export class AuthModule { }
