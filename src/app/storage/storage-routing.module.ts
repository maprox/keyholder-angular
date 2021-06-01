import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth';
import { StorageComponent } from './storage.component';

@NgModule({
  imports: [RouterModule.forChild([{
    path: 'storage',
    children: [{
      path: '**',
      component: StorageComponent,
    }],
    canActivate: [AuthGuard],
  }])],
  exports: [RouterModule],
})
export class StorageRoutingModule {}
