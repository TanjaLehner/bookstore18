import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { BookDetailsComponent } from './book-details/book-details.component';
import { BookListComponent } from './book-list/book-list.component';
import { HomeComponent } from './home/home.component';
import {BookFormComponent} from "./book-form/book-form.component";
import {CartComponent} from './cart/cart.component';
import {LoginComponent} from './admin/login/login.component';
import {OrderListComponent} from './order-list/order-list.component';
import {OrderDetailComponent} from "./order-detail/order-detail.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'books', component: BookListComponent },
  { path: 'books/:isbn', component: BookDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'cart/:isbn', component: BookDetailsComponent },
  { path: 'admin', component: BookFormComponent },
  { path: 'admin/:isbn', component: BookFormComponent },
  { path: 'orders/:user_id', component: OrderListComponent },
  { path: 'orders/:user_id/:order_id', component: OrderDetailComponent},
  { path: 'login', component: LoginComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
