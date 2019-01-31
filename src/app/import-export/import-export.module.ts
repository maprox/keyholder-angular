import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportComponent } from './export';
import { FileIoService } from './file-io.service';
import { ImportComponent } from './import';
import { ImportExportComponent } from './import-export.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    FileIoService,
  ],
  declarations: [
    ExportComponent,
    ImportComponent,
    ImportExportComponent,
  ],
  exports: [
    ImportExportComponent,
  ]
})
export class ImportExportModule { }
