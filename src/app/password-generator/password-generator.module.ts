import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
