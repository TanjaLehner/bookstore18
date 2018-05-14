import { Injectable } from '@angular/core';
import {Book, Author, Image} from "./book";
import {Order} from "./order";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {Rating} from "./rating";


@Injectable()
export class BookStoreService {
  private api = 'http://bookstore18-rest.s1510456019.student.kwmhgb.at/api';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Array<Book>> {
    return this.http.get(`${this.api}/books`)
      .retry(3).catch(this.errorHandler);
  }

  getOrdersFromUser(user_id: number): Observable<Array<Order>> {
      return this.http.get(`${this.api}/orders/${user_id}`)
          .retry(3).catch(this.errorHandler);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get(`${this.api}/order/${id}`)
        .retry(3).catch(this.errorHandler);
  }

  saveOrders(books: Book[], user_id: number) : Observable<any> {
    return this.http.post(`${this.api}/orders/save`, [books, user_id])
        .retry(3).catch(this.errorHandler);
  }

  saveRating(rating: Rating) : Observable<any> {
    return this.http.post(`${this.api}/ratings/save`, rating)
        .retry(3).catch(this.errorHandler);
  }

  getAllRatings(book_id: number):Observable<Array<Rating>>{
    return this.http.get<Rating>(`${this.api}/ratings/${book_id}`)
        .retry(3).catch(this.errorHandler);
  }

  getAuthors(): Observable<Array<Author>> {
    return this.http.get(`${this.api}/authors`)
        .retry(3).catch(this.errorHandler);
  }

  getSingle(isbn: string): Observable<Book> {
    return this.http.get<Book>(`${this.api}/book/${isbn}`)
      .retry(3).catch(this.errorHandler);
  }

  create(book: Book): Observable<any> {
    return this.http.post(`${this.api}/book`, book)
      .catch(this.errorHandler);
  }

  update(book: Book): Observable<any> {
    return this.http.put(`${this.api}/book/${book.isbn}`, book)
      .catch(this.errorHandler);
  }

  remove(isbn: string): Observable<any> {
    return this.http.delete(`${this.api}/book/${isbn}`)
      .catch(this.errorHandler);
  }

  getAllSearch(searchTerm: string): Observable<Array<Book>> {
    return this.http
      .get<Book>(`${this.api}/books/search/${searchTerm}`)
      .retry(3).catch(this.errorHandler);
  }

  private errorHandler(error: Error | any): Observable<any> {
    return Observable.throw(error);
  }
}
