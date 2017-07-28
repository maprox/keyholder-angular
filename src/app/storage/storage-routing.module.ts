import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StorageListComponent } from './storage-list';

@NgModule({
    imports: [RouterModule.forChild([{
        path: 'storage',
        children: [{
            path: '**',
            component: StorageListComponent
        }]
    }])],
    exports: [RouterModule]
})
export class StorageRoutingModule {}
