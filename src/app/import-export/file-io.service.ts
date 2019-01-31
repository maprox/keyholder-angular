import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import saveAs from 'file-saver';

@Injectable()
export class FileIoService {
  saveAs(contents, filename) {
    saveAs(contents, filename);
  }
  readFile(file: File): Observable<any> {
    const readEvent = new Subject<string>();
    const fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent: any) => {
      const textFromFileLoaded = fileLoadedEvent.target.result;
      const data = decodeURIComponent(textFromFileLoaded);
      readEvent.next(data);
    };
    fileReader.readAsText(file, 'UTF-8');
    return readEvent.asObservable();
  }
}
