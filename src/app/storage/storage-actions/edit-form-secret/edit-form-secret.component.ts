import { Component, OnInit } from '@angular/core';

import { PasswordGeneratorService } from '../../../password-generator';
import { Secret } from '../../model';
import { StorageService } from '../../storage.service';
import { EditFormComponent } from '../edit-form';
import { EditFormSecretService } from './edit-form-secret.service';

@Component({
    selector: 'app-edit-form-secret',
    templateUrl: './edit-form-secret.component.html',
    styleUrls: ['./edit-form-secret.component.scss']
})
export class EditFormSecretComponent extends EditFormComponent implements OnInit {
    detailsShown = false;

    itemSecret: string;
    itemContent: string;

    constructor(
        protected storage: StorageService,
        protected passwordGenerator: PasswordGeneratorService,
        protected editFormSecretService: EditFormSecretService
    ) {
        super(storage, editFormSecretService);
    }

    generate() {
        this.itemSecret = this.passwordGenerator.generate();
    }

    open(item: Secret) {
        this.itemSecret = item && item.getSecret() || '';
        this.itemContent = item && item.getContent() || '';
        if (!item) {
            this.generate();
        }
        super.open(item);
        this.detailsShown = this.isEditMode();
    }

    submit() {
        if (this.isEditMode()) {
            this.save(this.itemSource as Secret);
        } else {
            this.add(new Secret(
                this.itemName,
                this.itemSecret,
                this.itemContent
            ));
        }
        super.submit();
    }

    save(item: Secret) {
        item.setSecret(this.itemSecret);
        item.setContent(this.itemContent);
        super.save(item);
    }
}
