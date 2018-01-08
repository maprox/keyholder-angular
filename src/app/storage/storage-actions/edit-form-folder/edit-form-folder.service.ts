import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Folder } from '../../model';

@Injectable()
export class EditFormFolderService {
    private subject = new Subject<Object>();

    getEditEvent(): Observable<any> {
        return this.subject.asObservable();
    }

    edit(item: Folder) {
        this.subject.next(item);
    }

    create() {
        this.subject.next();
    }
}
