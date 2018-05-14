import { Component, OnInit } from '@angular/core';
import {Book} from "../shared/book";
import {AuthService} from '../shared/authentication.service';
import {BookStoreService} from "../shared/book-store.service";

@Component({
  selector: 'bs-cart',
  templateUrl: './cart.component.html',
  styles: []
})
export class CartComponent implements OnInit {
  books: Book[];

  constructor(
      public authService: AuthService,
      private bs: BookStoreService
  ) {
    this.books = new Array<Book>();
  }

    ngOnInit() {
        if (localStorage.books) this.books = JSON.parse(localStorage.books) as Array<Book>;
    }

    saveOrders() {
        if (localStorage.books) {
            this.bs.saveOrders(this.books, this.authService.getCurrentUserId()).subscribe(response => {
                window.location.replace('../orders/' + this.authService.getCurrentUserId());
                localStorage.removeItem("books");
            });
        }
    }
}
