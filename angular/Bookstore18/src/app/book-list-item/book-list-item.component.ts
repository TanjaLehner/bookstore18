import {Component, Input, OnInit} from '@angular/core';
import {Book, Author, Image} from "../shared/book";
import {BookStoreService} from "../shared/book-store.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'a.bs-book-list-item',
  templateUrl: './book-list-item.component.html',
  styles: []
})
export class BookListItemComponent implements OnInit {
  @Input() book: Book
  constructor() { }

  ngOnInit() { }

  toDecimal($number) {
    return $number.toFixed(2);
  }

}
