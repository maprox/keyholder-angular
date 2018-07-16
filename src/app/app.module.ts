import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AlertModule } from './alert';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth';
import { DemoWarningBarComponent } from './demo-warning-bar';
import { EncryptingService } from './encrypting';
import { HttpService } from './http';
import { NavigationComponent } from './navigation';
import { OfflineBarComponent } from './offline-bar';
import { PageNotFoundComponent } from './page-not-found';
import { SettingsModule } from './settings';
import { StorageModule } from './storage';

@NgModule({
    imports: [
        AlertModule,
        AuthModule,
        BrowserModule,
        StorageModule,
        SettingsModule,
        AppRoutingModule
    ],
    providers: [
        EncryptingService,
        HttpService
    ],
    declarations: [
        AppComponent,
        NavigationComponent,
        PageNotFoundComponent,
        OfflineBarComponent,
        DemoWarningBarComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
