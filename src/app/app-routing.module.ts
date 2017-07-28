import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSerializer } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found';
import { CustomUrlSerializer } from './custom-url-serializer';

export const routes: Routes = [
    { path: '', redirectTo: '/storage', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    providers: [{ provide: UrlSerializer, useClass: CustomUrlSerializer }],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
