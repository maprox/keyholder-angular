import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthGuard } from './auth.guard';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { ForkMeComponent } from '../fork-me';
import { LoginComponent, RegexpErrorComponent } from './login';
import { LogoutComponent } from './logout';

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
        ForkMeComponent,
        LoginComponent,
        LogoutComponent,
        RegexpErrorComponent
    ],
    exports: [
        LoginComponent,
        LogoutComponent
    ]
})
export class AuthModule { }
