import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AuthInterceptor } from './auth.interceptor';

import { LoginComponent } from './login';
import { LogoutComponent } from './logout';
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
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        }
    ],
    declarations: [
        LoginComponent,
        LogoutComponent
    ],
    exports: [
        LoginComponent,
        LogoutComponent
    ]
})
export class AuthModule { }
