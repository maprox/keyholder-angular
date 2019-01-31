import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StorageApiService, StorageService } from '../../storage';
import { FileIoService } from '../file-io.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  static getFilename() {
    const timestamp = formatDate(new Date(), 'yyyy-MM-ddTHH-mm-ss', 'en');
    return `storage-backup-${timestamp}.kh`;
  }

  constructor(
    private storageApi: StorageApiService,
    private storageService: StorageService,
    private fileIoService: FileIoService
  ) { }

  ngOnInit() {}

  export() {
    const data = this.storageApi.getEncryptedStorageContainer(this.storageService.getRoot());
    const blob = new Blob([data], { type: 'text/plain' });
    this.fileIoService.saveAs(blob, ExportComponent.getFilename());
  }
}
