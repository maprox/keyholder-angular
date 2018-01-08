import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PasswordGeneratorModule } from '../../password-generator';
import { EditFormFolderComponent, EditFormFolderService } from './edit-form-folder';
import { EditFormSecretComponent, EditFormSecretService } from './edit-form-secret';
import { StorageActionsComponent } from './storage-actions.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PasswordGeneratorModule
    ],
    providers: [
        EditFormSecretService,
        EditFormFolderService
    ],
    declarations: [
        EditFormFolderComponent,
        EditFormSecretComponent,
        StorageActionsComponent
    ],
    exports: [
        StorageActionsComponent
    ]
})
export class StorageActionsModule { }
