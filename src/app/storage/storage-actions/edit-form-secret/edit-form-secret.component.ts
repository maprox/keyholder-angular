import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { PasswordGeneratorService } from '../../../password-generator';
import { Folder, Item, Secret } from '../../model';
import { StorageService } from '../../storage.service';

@Component({
    selector: 'app-edit-form-secret',
    templateUrl: './edit-form-secret.component.html',
    styleUrls: ['./edit-form-secret.component.scss']
})
export class EditFormSecretComponent implements OnInit {
    @ViewChild('fieldName') fieldName: ElementRef;

    detailsShown = false;

    itemName: string;
    itemSecret: string;
    itemContent: string;

    constructor(
        private storage: StorageService,
        private passwordGenerator: PasswordGeneratorService
    ) {}

    ngOnInit() {
        this.detailsShown = false;
        this.generate();
        this.focusName();
    }

    private addItem(item: Item) {
        this.storage.getCurrent().add(item);
        this.storage.save();
        this.itemName = '';
        this.itemSecret = '';
        this.itemContent = '';
    }

    private focusName() {
        setTimeout(() => {
            if (this.fieldName && this.fieldName.nativeElement) {
                this.fieldName.nativeElement.focus();
            }
        });
    }

    removeItem(folder: Folder, item: Item) {
        folder.removeItem(item);
        this.storage.save();
    }

    submit() {
        this.addItem(new Secret(
            this.itemName,
            this.itemSecret,
            this.itemContent
        ));
    }

    generate() {
        this.itemSecret = this.passwordGenerator.generate();
    }
}
