import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';

import {BookFormErrorMessages} from './book-form-error-messages';
import {BookFactory} from '../shared/book-factory';
import {BookStoreService} from '../shared/book-store.service';
import {Book} from '../shared/book';

@Component({
    selector: 'bs-book-form',
    templateUrl: './book-form.component.html'
})
export class BookFormComponent implements OnInit {
    myForm: FormGroup;
    book = BookFactory.empty();
    errors: { [key: string]: string } = {};
    isUpdatingBook = false;
    thumbnails: FormArray;
    authors: FormArray;

    constructor(private fb: FormBuilder, private bs: BookStoreService,
                private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        const isbn = this.route.snapshot.params['isbn'];
        if (isbn) {
            this.isUpdatingBook = true;
            this.bs.getSingle(isbn).subscribe(book => {
                this.book = book;
                this.buildThumbnailsArray();
                this.buildAuthorsArray();
            });
        }
        this.updateBook();
        this.buildThumbnailsArray();
        this.buildAuthorsArray();
    }

    updateBook() {
        this.myForm = this.fb.group({
            id: this.book.id,
            title: [this.book.title, Validators.required],
            subtitle: this.book.subtitle,
            isbn: [this.book.isbn, [
                Validators.required
            ]],
            description: this.book.description,
            thumbnails: this.thumbnails,
            authors: this.authors,
            published: new Date(this.book.published),
            price_netto: [this.book.price_netto, Validators.required],
            price_brutto: [this.book.price_brutto, Validators.required]
        });
        this.myForm.statusChanges.subscribe(() => this.updateErrorMessages());
    }

    buildAuthorsArray() {
        this.bs.getAuthors().subscribe(res => {
            //this.authorsForm = this.fb.array(res.map(a => this.isAuthor(a.id)));
            this.authors = this.fb.array(
                res.map(
                    a => this.fb.group({
                        id: this.fb.control(a.id),
                        firstName: this.fb.control(a.firstName),
                        lastName: this.fb.control(a.lastName),
                        check: this.fb.control(this.isAuthor(a.id))
                    })
                )
            );
            this.updateBook();
        });
    }

    isAuthor(id) {
        for (let i = 0; i < this.book.authors.length; i++) {
            if (this.book.authors[i].id === id) return true;
        }
        return false;
    }

    buildThumbnailsArray() {
        this.thumbnails = this.fb.array(
            this.book.images.map(
                t => this.fb.group({
                    id: this.fb.control(t.id),
                    url: this.fb.control(t.url, [Validators.required]),
                    title: this.fb.control(t.title)
                })
            )
        );
        this.updateBook();
    }

    addThumbnailControl() {
        this.thumbnails.push(this.fb.group({url: null, title: null}));
    }

    removeThumbnailControl(index) {
        this.thumbnails.removeAt(index);
    }

    submitForm() {
        // filter empty values
        this.myForm.value.thumbnails = this.myForm.value.thumbnails.filter(thumbnail => thumbnail.url);
        this.myForm.value.authors = this.myForm.value.authors.filter(authors => authors.check);

        const book: Book = BookFactory.fromObject(this.myForm.value);
        //just copy the rating and authors
        //book.rating = this.book.rating;
        //book.authors = this.book.authors;

        if (this.isUpdatingBook) {
            this.bs.update(book).subscribe(() => {
                this.router.navigate(['../../books', book.isbn], {relativeTo: this.route});
            });
        } else {
            book.user_id = 1;// jsut for testing
            this.bs.create(book).subscribe(() => {
                this.book = BookFactory.empty();
                this.myForm.reset(BookFactory.empty());
                this.buildAuthorsArray();
            });
        }
    }

    updateErrorMessages() {
        this.errors = {};
        for (const message of BookFormErrorMessages) {
            const control = this.myForm.get(message.forControl);
            if (control &&
                control.dirty &&
                control.invalid &&
                control.errors[message.forValidator] &&
                !this.errors[message.forControl]) {
                this.errors[message.forControl] = message.text;
            }
        }
    }
}
