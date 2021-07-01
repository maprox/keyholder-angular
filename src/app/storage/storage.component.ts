import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../auth';
import { Folder, Item } from './model';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss'],
})
export class StorageComponent implements OnInit, OnDestroy {
  root: Folder;
  parent: Folder;
  current: Folder;

  currentPath: string;

  private routerSubscription: any;

  constructor(
    private router: Router,
    private storage: StorageService,
    private auth: AuthService,
  ) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.auth.isLoggedIn()) {
        const urlParts = decodeURIComponent(event.urlAfterRedirects).split('/');
        this.currentPath = urlParts.splice(2).join('/');
        if (this.storage.isAvailable) {
          this.setRoot(this.storage.getRoot());
          this.setCurrent(this.getCurrentFolderByPath(this.currentPath));
        } else {
          this.storage.load();
        }
      }
    });
  }

  ngOnInit() {
    this.storage.onChange().subscribe((root) => {
      this.setRoot(root);
      if (this.currentPath) {
        this.setCurrent(this.getCurrentFolderByPath(this.currentPath));
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  setRoot(root: Folder) {
    this.root = root;
    this.setCurrent(root);
  }

  setCurrent(current: Folder) {
    if (!current) {
      return;
    }
    this.current = current;
    this.parent = this.getParentFolder(current);
  }

  getParentFolder(current: Folder): Folder {
    const path = this.getCurrentPath();
    return path[path.length - 2] as Folder;
  }

  getCurrentPath(): Folder[] {
    return this.root && this.current ?
      [this.root, ...this.root.find(this.current)] : [];
  }

  getCurrentFolderByPath(path: string): Folder {
    return path.split('/').reduce((current, folderName: string) => {
      return current && current.getFolderByName(folderName);
    }, this.root);
  }

  getCurrentPathAsString(): string {
    let result = '';
    this.getCurrentPath().map((item, index) => {
      if (index === 0) {
        // skip root folder
        return;
      }
      result += (result ? '/' : '') + item.getName();
    });
    return '/' + result;
  }

  updateRoute() {
    if (!this.storage.isInSearchMode) {
      this.router.navigate(['/storage' + this.getCurrentPathAsString()]);
    }
  }

  onFolderClicked(folder: Folder) {
    this.setCurrent(folder);
    this.updateRoute();
  }

  onItemAdd(item: Item) {
    if (item instanceof Folder) {
      this.setCurrent(item);
      this.updateRoute();
    }
    this.storage.save();
  }

  onItemRemove(item: Item) {
    this.storage.save();
  }

  onItemChange(item: Item) {
    this.storage.save();
  }
}
