import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StorageService } from './storage.service';
import { StorageListComponent } from './storage-list/storage-list.component';
import { StorageRoutingModule } from './storage-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        StorageRoutingModule,
    ],
    providers: [
        StorageService
    ],
    declarations: [StorageListComponent],
    exports: [StorageListComponent]
})
export class StorageModule { }
