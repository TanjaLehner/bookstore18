import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/do'
import {BookStoreService} from '../shared/book-store.service';
import {Book} from '../shared/book';

@Component({
  selector: 'bs-search',
  templateUrl: './search.component.html',
  styles: []
})
export class SearchComponent implements OnInit {

  foundBooks: Book[] = [];
  isLoading = false;
  keyup = new EventEmitter<string>();
  @Output() bookSelected = new EventEmitter<Book>();

  constructor(private bs: BookStoreService){ }

  ngOnInit() {
    this.keyup
      .debounceTime(500)
      .distinctUntilChanged()
      .do(() => this.isLoading = true)
      .switchMap(searchTerm => this.bs.getAllSearch(searchTerm))
      .do(() => this.isLoading = false)
      .subscribe(books => this.foundBooks = books);
  }
}
