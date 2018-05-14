import { Component } from '@angular/core';
import {Book} from "./shared/book";
import {AuthService} from './shared/authentication.service';

@Component({
  selector: 'bs-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(private authService: AuthService){}

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  getCurrentUserId(){
    return this.authService.getCurrentUserId();
  }

  isAdmin(){
    return this.authService.isAdmin();
  }

  getLoginLabel() {
    if(this.isLoggedIn()) {
      return "Logout";
    } else {
      return "Login";
    }
  }

}
