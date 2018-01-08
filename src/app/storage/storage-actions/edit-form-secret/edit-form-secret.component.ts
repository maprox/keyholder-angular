import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { PasswordGeneratorService } from '../../../password-generator';
import { Folder, Item, Secret } from '../../model';
import { StorageService } from '../../storage.service';
import { EditFormSecretService } from './edit-form-secret.service';

@Component({
    selector: 'app-edit-form-secret',
    templateUrl: './edit-form-secret.component.html',
    styleUrls: ['./edit-form-secret.component.scss']
})
export class EditFormSecretComponent implements OnInit {
    @ViewChild('fieldName') fieldName: ElementRef;

    isActive = false;
    detailsShown = false;

    itemSource: Item;
    itemName: string;
    itemSecret: string;
    itemContent: string;

    constructor(
        private storage: StorageService,
        private passwordGenerator: PasswordGeneratorService,
        private editFormSecretService: EditFormSecretService
    ) {}

    ngOnInit() {
        this.editFormSecretService.getEditEvent().subscribe(this.open.bind(this));
    }

    open(item: Secret) {
        this.detailsShown = false;
        this.itemSource = item;
        this.itemName = item && item.getName() || '';
        this.itemSecret = item && item.getSecret() || '';
        this.itemContent = item && item.getContent() || '';
        if (!item) {
            this.generate();
        }
        this.focusName();
        this.isActive = true;
    }

    close() {
        this.isActive = false;
    }

    private addItem(item: Item) {
        this.storage.getCurrent().add(item);
        this.storage.save();
        this.close();
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
