import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login';
import { LogoutComponent } from './logout';

@NgModule({
    imports: [RouterModule.forChild([{
        path: 'login',
        component: LoginComponent
    }, {
        path: 'logout',
        component: LogoutComponent
    }, {
        path: 'register',
        component: LoginComponent,
        data: {
            signUp: true
        }
    }])],
    exports: [RouterModule]
})
export class AuthRoutingModule {}
