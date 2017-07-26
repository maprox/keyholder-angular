import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StorageListComponent } from './storage-list/storage-list.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'storage', component: StorageListComponent}
    ])],
    exports: [RouterModule]
})
export class StorageRoutingModule {}
