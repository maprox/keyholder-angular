import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StorageApiService, StorageService } from '../../storage';

import saveAs from 'file-saver';

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
    constructor(
        private storageApi: StorageApiService,
        private storageService: StorageService
    ) { }

    ngOnInit() {
    }

    getFilename() {
        const timestamp = formatDate(new Date(), 'yyyy-MM-ddTHH-mm-ss', 'en');
        return `storage-backup-${timestamp}.ksb`;
    }

    export() {
        const data = this.storageApi.getEncryptedStorageContainer(this.storageService.getRoot());
        const blob = new Blob([data], { type: 'text/plain' });
        saveAs(blob, this.getFilename());
    }

    fileChanged(event: any) {
        // tbd
    }
}
