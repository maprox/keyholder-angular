import { Component, OnInit } from '@angular/core';

import { StorageService } from './storage.service';

@Component({
    selector: 'app-storage',
    templateUrl: './storage.component.html',
    styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {
    constructor(
        private storage: StorageService
    ) {}

    ngOnInit() {
        this.storage.load();
    }
}
