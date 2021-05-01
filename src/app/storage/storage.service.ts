import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { AuthService } from '../auth';
import { Folder, Item, Secret } from './model';
import { StorageApiService } from './storage-api.service';

@Injectable()
export class StorageService {
  private subject = new Subject<Object>();
  private root: Folder;
  private originalRoot: Folder;
  private isLoaded = false;
  private isSearchMode = false;

  get isAvailable(): boolean {
    return this.isLoaded;
  }

  get isInSearchMode(): boolean {
    return this.isSearchMode;
  }

  constructor(
    public storageApi: StorageApiService,
    private auth: AuthService
  ) {
    auth.getAuthEvent().subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        this.isLoaded = false;
      }
    });
  }

  onChange(): Observable<any> {
    return this.subject.asObservable();
  }

  getRoot(): Folder {
    return this.root;
  }

  setRoot(root: Folder) {
    this.root = root;
    this.subject.next(root);
  }

  setSearchMode(isSearchMode: boolean) {
    this.isSearchMode = isSearchMode;
  }

  search(query: string) {
    if (!query || !query.trim()) {
      this.setSearchMode(false);
      this.setRoot(this.originalRoot);
      return;
    }
    const q = query.toLowerCase();
    const results: Item[] = this.searchFolder(q, this.originalRoot);
    const searchFolder = new Folder('Search results');
    results.forEach(item => searchFolder.add(item));
    this.setSearchMode(true);
    this.setRoot(searchFolder);
  }

  searchFolder(query: string, folder: Folder): Item[] {
    const match = item => item.getName().toLowerCase().indexOf(query) >= 0
      || (item instanceof Secret
        && (item as Secret).getContent().toLowerCase().indexOf(query) >= 0);
    return [].concat(
      folder.getFolders().filter(match),
      folder.getItems().filter(match),
      ...folder.getFolders()
        .map(subfolder => this.searchFolder(query, subfolder))
    );
  }

  save() {
    if (this.isInSearchMode) {
      return;
    }
    this.storageApi.save(this.getRoot());
  }

  load() {
    if (this.isLoaded) {
      return;
    }

    this.storageApi.load().pipe(first()).subscribe(
      container => {
        this.isLoaded = true;
        this.originalRoot = container.getStorage();
        this.setRoot(this.originalRoot);
      }
    );
  }
}
