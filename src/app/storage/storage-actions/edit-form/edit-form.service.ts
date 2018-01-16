import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Item } from '../../model';

@Injectable()
export class EditFormService {
    private subject = new Subject<Object>();

    getEditEvent(): Observable<any> {
        return this.subject.asObservable();
    }

    edit(item: Item) {
        this.subject.next(item);
    }

    create() {
        this.subject.next();
    }

    close() {
        this.subject.next(null);
    }
}
