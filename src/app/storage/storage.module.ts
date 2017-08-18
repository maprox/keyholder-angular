import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StorageService } from './storage.service';
import { StoragePathComponent } from './storage-path';
import { StorageListComponent } from './storage-list';
import { StorageActionsComponent } from './storage-actions';
import { StorageComponent } from './storage.component';
import { StorageRoutingModule } from './storage-routing.module';

import { PasswordGeneratorModule } from '../password-generator';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PasswordGeneratorModule,
        StorageRoutingModule,
    ],
    providers: [
        StorageService
    ],
    declarations: [
        StoragePathComponent,
        StorageListComponent,
        StorageActionsComponent,
        StorageComponent
    ],
    exports: [StorageComponent]
})
export class StorageModule { }
