import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

import { StorageService } from './storage.service';
import { StorageComponent } from './storage.component';
import { AuthGuard, AuthService } from '../auth';

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
    private storage: StorageService,
    private auth: AuthService
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd && auth.isLoggedIn()) {
        const urlParts = decodeURIComponent(event.url).split('/');
        if (urlParts[1] === 'storage') {
          storage.load(urlParts.splice(2).join('/'));
        }
      }
    });
  }
}
