import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        AuthService,
        AuthGuard
    ],
    declarations: []
})
export class AuthModule { }
