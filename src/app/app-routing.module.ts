import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSerializer } from '@angular/router';

import { CustomUrlSerializer } from './custom-url-serializer';
import { PageNotFoundComponent } from './page-not-found';

export const routes: Routes = [
    { path: '', redirectTo: '/storage', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    providers: [{ provide: UrlSerializer, useClass: CustomUrlSerializer }],
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
