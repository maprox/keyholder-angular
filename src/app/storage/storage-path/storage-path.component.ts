import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Folder } from '../model';
import { StorageService } from '../storage.service';

@Component({
    selector: 'app-storage-path',
    templateUrl: './storage-path.component.html',
    styleUrls: ['./storage-path.component.scss']
})
export class StoragePathComponent implements OnInit {
    constructor(
        private router: Router,
        public storage: StorageService
    ) { }

    ngOnInit() {
    }

    openFolder(folder: Folder) {
        this.storage.openFolder(folder);
        this.router.navigate(['/storage' + this.storage.getPathAsString()]);
    }
}
