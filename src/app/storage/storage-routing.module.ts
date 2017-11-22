import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

import { StorageService } from './storage.service';
import { StorageComponent } from './storage.component';
import { AuthGuard } from '../auth';

@NgModule({
    imports: [RouterModule.forChild([{
        path: 'storage',
        children: [{
            path: '**',
            component: StorageComponent
        }],
        canActivate: [AuthGuard]
    }])],
    exports: [RouterModule]
})
export class StorageRoutingModule {
    constructor(
        private router: Router,
        private storage: StorageService
    ) {
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.storage.openPath(decodeURIComponent(event.url));
            }
        });
    }
}
