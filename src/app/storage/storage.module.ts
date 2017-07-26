import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageService } from './storage.service';
import { StorageListComponent } from './storage-list/storage-list.component';
import { StorageRoutingModule } from './storage-routing.module';

@NgModule({
    imports: [
        CommonModule,
        StorageRoutingModule,
    ],
    providers: [
        StorageService
    ],
    declarations: [StorageListComponent],
    exports: [StorageListComponent]
})
export class StorageModule { }
