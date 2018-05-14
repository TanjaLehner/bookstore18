import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Book} from '../shared/book';
import {BookStoreService} from "../shared/book-store.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BookFactory} from "../shared/book-factory";
import {AuthService} from "../shared/authentication.service";
import {FormBuilder, FormGroup, Validators, Form, NgModel} from "@angular/forms";
import {Rating} from "../shared/rating";

@Component({
    selector: 'bs-book-details',
    templateUrl: './book-details.component.html',
    styles: []
})
export class BookDetailsComponent implements OnInit {
    book: Book = BookFactory.empty();
    ratings: Rating[];
    myRatingForm: FormGroup;
    rating: Rating = new Rating(null, null, null, null, null);

    constructor(private fb: FormBuilder,
                private bs: BookStoreService,
                private router: Router,
                private route: ActivatedRoute,
                public authService: AuthService) {
    }

    ngOnInit() {
        const params = this.route.snapshot.params;
        this.bs.getSingle(params['isbn']).subscribe(res => {
            this.book = res;
            this.getRatings();
        });
        this.myRatingForm = this.fb.group({
            id: this.rating.id,
            stars: [this.rating.stars, Validators.required],
            comment: this.rating.comment,
            book_id: this.book.id,
            user_id: this.authService.getCurrentUserId()
        });
    }

    toDecimal($number) {
        return $number.toFixed(2);
    }

    getRatingFromBook(rating: Rating) {
        return Array(rating.stars);
    }

    getRatings() {
        this.bs.getAllRatings(this.book.id).subscribe(res=>{this.ratings=res});
    }

    alreadyRated() {
        for(let i = 0; i < this.ratings.length; i++) {
            if (this.ratings[i].user_id === this.authService.getCurrentUserId()) return true;
        }
        return false;
    }

    getAvgRating() {
        if (this.ratings && this.ratings.length > 0) {
            let sum = 0;
            for(let i = 0; i < this.ratings.length; i++) {sum += this.ratings[i].stars;}
            return Array(Math.floor(sum / this.ratings.length));
        } else return Array(0)
    }

    removeBook() {
        if (confirm('Buch wirklich löschen?')) {
            this.bs.remove(this.book.isbn)
                .subscribe(res => this.router.navigate(['../'], {relativeTo: this.route}));
        }
    }

    //legt Buch in Warenkorb - wird aufgrufen wenn man auf Button im html klickt
    addBookToCart() {
        if (!localStorage.books) localStorage.setItem("books", JSON.stringify([]));
        let books = JSON.parse(localStorage.books);
        books.push(this.book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    submitRatingForm() {
        this.rating.stars = this.myRatingForm.value.stars;
        this.rating.comment = this.myRatingForm.value.comment;
        this.rating.book_id = this.book.id;
        this.rating.user_id = this.authService.getCurrentUserId();

        this.bs.saveRating(this.rating).subscribe(res => {this.rating = res});
        this.myRatingForm.reset(this.myRatingForm);
        window.location.reload();
    }

    isAdmin() {
        return this.authService.isAdmin();
    }
}