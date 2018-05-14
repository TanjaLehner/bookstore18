import { Component, OnInit } from '@angular/core';
import {Order} from "../shared/order";
import {BookStoreService} from "../shared/book-store.service";
import {ActivatedRoute} from "@angular/router";
import {Author} from "../shared/author";
import {Book} from "../shared/book";

@Component({
  selector: 'bs-order-list',
  templateUrl: './order-list.component.html',
  styles: []
})
export class OrderListComponent implements OnInit {
  orders: Order[];

  constructor(private bs: BookStoreService, private route: ActivatedRoute) {}

    ngOnInit() {
        const user_id = this.route.snapshot.params['user_id'];
        this.bs.getOrdersFromUser(user_id).subscribe(
            res => {
                this.orders = res;
            });
    }

}
