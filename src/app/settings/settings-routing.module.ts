import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
    imports: [RouterModule.forChild([{
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard]
    }])],
    exports: [RouterModule]
})
export class SettingsRoutingModule {}
