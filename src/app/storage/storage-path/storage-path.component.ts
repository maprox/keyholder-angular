import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StorageService } from '../storage.service';
import { Folder } from '../model';

@Component({
    selector: 'app-storage-path',
    templateUrl: './storage-path.component.html',
    styleUrls: ['./storage-path.component.css']
})
export class StoragePathComponent implements OnInit {

    constructor(
        private router: Router,
        private storage: StorageService
    ) { }

    ngOnInit() {
    }

    openFolder(folder: Folder) {
        this.storage.openFolder(folder);
        this.router.navigate(['/storage', this.storage.getPathAsString()]);
    }

}
