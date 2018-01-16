import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Item } from '../../model';
import { StorageService } from '../../storage.service';
import { EditFormService } from './edit-form.service';

@Component({
    selector: 'app-edit-form',
    templateUrl: './edit-form.component.html',
    styleUrls: ['./edit-form.component.scss']
})
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
        this.editFormService.getEditEvent().subscribe(this.open.bind(this));
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

    addItem(item: Item) {
        this.storage.getCurrent().add(item);
        this.storage.save();
        this.close();
    }

    removeItem(item: Item) {
        this.storage.getCurrent().removeItem(item);
        this.storage.save();
        this.close();
    }

    abstract submit()
}
