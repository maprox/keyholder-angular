import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageService } from './storage.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
      StorageService
  ],
  declarations: []
})
export class StorageModule { }
