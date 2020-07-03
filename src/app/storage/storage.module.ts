import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { LongPressModule } from '../long-press';

import { StorageActionsModule } from './storage-actions';
import { StorageApiService } from './storage-api.service';
import { StorageListComponent } from './storage-list';
import { StoragePathComponent } from './storage-path';
import { StorageRoutingModule } from './storage-routing.module';
import { StorageComponent } from './storage.component';
import { StorageService } from './storage.service';
import { SearchComponent } from './search';

@NgModule({
    imports: [
        ClipboardModule,
        CommonModule,
        FormsModule,
        LongPressModule,
        StorageActionsModule,
        StorageRoutingModule
    ],
    providers: [
        StorageService,
        StorageApiService
    ],
    declarations: [
        StoragePathComponent,
        StorageListComponent,
        StorageComponent,
        SearchComponent
    ],
    exports: [
        StorageComponent,
        SearchComponent
    ]
})
export class StorageModule { }
