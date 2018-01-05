import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';

import { PasswordGeneratorModule } from '../password-generator';
import { StorageActionsComponent, EditFormFolderComponent,
    EditFormSecretComponent } from './storage-actions';
import { StorageApiService } from './storage-api.service';
import { StorageListComponent } from './storage-list';
import { StoragePathComponent } from './storage-path';
import { StorageRoutingModule } from './storage-routing.module';
import { StorageComponent } from './storage.component';
import { StorageService } from './storage.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PasswordGeneratorModule,
        StorageRoutingModule,
        ClipboardModule
    ],
    providers: [
        StorageService,
        StorageApiService
    ],
    declarations: [
        EditFormFolderComponent,
        EditFormSecretComponent,
        StoragePathComponent,
        StorageListComponent,
        StorageActionsComponent,
        StorageComponent
    ],
    exports: [
        StorageComponent
    ]
})
export class StorageModule { }
