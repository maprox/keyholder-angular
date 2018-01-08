import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Secret } from '../../model';

@Injectable()
export class EditFormSecretService {
    private subject = new Subject<Object>();

    getEditEvent(): Observable<any> {
        return this.subject.asObservable();
    }

    edit(item: Secret) {
        this.subject.next(item);
    }

    create() {
        this.subject.next();
    }
}
