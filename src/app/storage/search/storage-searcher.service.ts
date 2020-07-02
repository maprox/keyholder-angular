import { Injectable } from '@angular/core';
import { Folder, Item } from '../model';
import { StorageService } from '../storage.service';

@Injectable()
export class StorageSearcherService {
  constructor(
    private storage: StorageService
  ) { }

  search(query: string) {
    this.storage.search(query);
  }
}
