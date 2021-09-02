import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Folder } from '../model';

@Component({
  selector: 'app-storage-path',
  templateUrl: './storage-path.component.html',
  styleUrls: ['./storage-path.component.scss']
})
export class StoragePathComponent implements OnChanges {
  @Input() root: Folder;
  @Input() current: Folder;

  @Output() folderClicked = new EventEmitter<Folder>();

  path: Folder[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.root) {
      this.path = [];
      return;
    }
    this.path = [this.root, ...this.root.find(this.current)];
  }

  openFolder(folder: Folder) {
    this.folderClicked.emit(folder);
  }
}
