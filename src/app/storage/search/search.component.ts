import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageSearcherService } from './storage-searcher.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  search = '';

  constructor(
      private router: Router,
      private storageSearcher: StorageSearcherService
  ) { }

  ngOnInit() {
  }

  onChange(query: string) {
    this.storageSearcher.search(query);
  }
}
