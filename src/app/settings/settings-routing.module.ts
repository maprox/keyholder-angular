import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from '../auth';

@NgModule({
    imports: [RouterModule.forChild([{
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard]
    }])],
    exports: [RouterModule]
})
export class SettingsRoutingModule {}
