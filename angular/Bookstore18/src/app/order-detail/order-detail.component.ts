import {Component, OnInit} from '@angular/core';
import {Order} from "../shared/order";
import {ActivatedRoute} from "@angular/router";
import {BookStoreService} from "../shared/book-store.service";

@Component({
    selector: 'bs-order-detail',
    templateUrl: './order-detail.component.html',
    styles: []
})
export class OrderDetailComponent implements OnInit {
    order: Order = new Order(null, null, null, null);
    sum_brutto = null;
    sum_netto = null;
    mwst = null;

    constructor(private bs: BookStoreService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        const params = this.route.snapshot.params;
        this.bs.getOrderById(params['order_id']).subscribe(response => {
            this.order = response;
            if (!!this.order && !!this.order.books) {
                this.sum_brutto = 0;
                this.sum_netto = 0;
                for (let i = 0; i < this.order.books.length; i++) {
                    this.sum_brutto += this.order.books[i].price_brutto;
                    this.sum_netto += this.order.books[i].price_netto;
                }
                this.sum_brutto = this.sum_brutto.toFixed(2);
                this.sum_netto = this.sum_netto.toFixed(2);
                this.mwst = this.sum_brutto-this.sum_netto;
                this.mwst = this.mwst.toFixed(2)
            }
        });
    }

}
