import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-import-export',
    templateUrl: './import-export.component.html',
    styleUrls: ['./import-export.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ImportExportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
