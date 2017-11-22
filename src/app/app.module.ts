import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth';
import { StorageModule } from './storage';
import { SettingsModule } from './settings';
import { PageNotFoundComponent } from './page-not-found';
import { AlertService, AlertComponent } from './alert';

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
    bootstrap: [AppComponent]
})
export class AppModule { }
