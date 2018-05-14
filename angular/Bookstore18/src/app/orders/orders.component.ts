import {Component, Input, OnInit} from '@angular/core';
import {Order} from "../shared/order";
import {Book} from "../shared/book";

@Component({
    selector: 'a.bs-orders',
    templateUrl: './orders.component.html',
    styles: []
})
export class OrdersComponent implements OnInit {
    @Input() order: Order;
    sum_brutto = 0;
    sum_netto = 0;

    constructor() {
    }

    ngOnInit() {
        if (this.order !== undefined && this.order.books !== undefined) {
            this.sum_brutto = 0;
            this.sum_netto = 0;
            for (let i = 0; i < this.order.books.length; i++) {
                this.sum_brutto += this.order.books[i].price_brutto;
                this.sum_netto += this.order.books[i].price_netto;
            }
        }
    }

}