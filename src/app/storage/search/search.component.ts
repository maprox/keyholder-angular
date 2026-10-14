import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SearchComponent implements OnInit {

  search = '';

  constructor(
      private router: Router,
      private storage: StorageService
  ) { }

  ngOnInit() {
  }

  onChange(query: string) {
    this.storage.search(query);
  }
}
