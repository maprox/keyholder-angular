import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AlertComponent, AlertService } from './alert';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth';
import { PageNotFoundComponent } from './page-not-found';
import { SettingsModule } from './settings';
import { StorageModule } from './storage';

@NgModule({
    imports: [
        AuthModule,
        BrowserModule,
        StorageModule,
        SettingsModule,
        AppRoutingModule,
    ],
    providers: [
        AlertService
    ],
    declarations: [
        AlertComponent,
        AppComponent,
        PageNotFoundComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
