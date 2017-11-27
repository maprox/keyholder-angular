import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PasswordGeneratorService } from './password-generator.service';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        PasswordGeneratorService
    ],
    declarations: []
})
export class PasswordGeneratorModule { }
