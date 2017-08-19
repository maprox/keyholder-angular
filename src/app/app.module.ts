import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { StorageModule } from './storage';
import { SettingsModule } from './settings';
import { PageNotFoundComponent } from './page-not-found';

@NgModule({
    imports: [
        BrowserModule,
        StorageModule,
        SettingsModule,
        AppRoutingModule
    ],
    providers: [],
    declarations: [AppComponent, PageNotFoundComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
