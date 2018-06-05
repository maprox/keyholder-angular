import { ElementRef, OnInit, ViewChild } from '@angular/core';

import { Item } from '../../model';
import { StorageService } from '../../storage.service';
import { EditFormService } from './edit-form.service';

export abstract class EditFormComponent implements OnInit {
    @ViewChild('fieldName') fieldName: ElementRef;

    isActive = false;

    itemSource: Item;
    itemName: string;

    constructor(
        protected storage: StorageService,
        protected editFormService: EditFormService
    ) {}

    ngOnInit() {
        this.editFormService.getEditEvent().subscribe((item) => {
            if (item === null) {
                this.close();
            } else {
                this.open(item);
            }
        });
    }

    focusName() {
        setTimeout(() => {
            if (this.fieldName && this.fieldName.nativeElement) {
                this.fieldName.nativeElement.focus();
            }
        });
    }

    isEditMode(): boolean {
        return !!this.itemSource;
    }

    open(item: Item) {
        this.itemSource = item;
        this.itemName = item && item.getName() || '';
        this.focusName();
        this.isActive = true;
    }

    close() {
        this.isActive = false;
    }

    add(item: Item) {
        this.storage.getCurrent().add(item);
        this.storage.save();
    }

    save(item: Item) {
        item.setName(this.itemName);
        this.storage.save();
    }

    remove(item: Item) {
        this.storage.getCurrent().remove(item);
        this.storage.save();
        this.close();
    }

    submit() {
        this.close();
    }
}
