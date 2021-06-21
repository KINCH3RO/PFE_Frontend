import { HttpClient } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { promise } from 'selenium-webdriver';
import { User } from '../models/user';
import { EventemitterService } from './eventemitter.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public storageKey = "CURRENT_USER"
  public isUserLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private eventEmiiter: EventemitterService) { }

  async login(values) {
    var returnedValue: any;
    await this.http.post<User>("http://localhost:8080/api/users/login", values).toPromise().then(data => {
      if(data.accountStatus !="normal"){
        returnedValue = "We're so sorry , your account is "+ data.accountStatus;
        return;
      }
      var user: User = data;
      user.password = "";
      localStorage.setItem(this.storageKey, JSON.stringify(user));
      this.isUserLogged.next(true);
      returnedValue = true;
    }).catch(err => {
      returnedValue = err.error

    });

    return returnedValue;
  }

  checkIfuserNameExist(username) {
    this.http.get<User[]>("http://localhost:8080/api/users/all").toPromise().then(response => {
      console.log(response)
      if (response.find(data => data.userName === username)) {
        this.eventEmiiter.showPopUP({ type: 'warning', message: 'Username already exist' })
      }
    }).catch(err => {
      this.eventEmiiter.showPopUP({ type: 'error', message: 'an error has been occured' })
    });
  }

  checkIfEmailExist(email) {
    this.http.get<User[]>("http://localhost:8080/api/users/all").toPromise().then(response => {
      console.log(response)
      if (response.find(data => data.email === email)) {
        this.eventEmiiter.showPopUP({ type: 'warning', message: 'Email already exist' })
      }
    }).catch(err => {
      this.eventEmiiter.showPopUP({ type: 'error', message: 'an error has been occured' })
    });
  }

  logout() {
    this.isUserLogged.next(false);
    localStorage.removeItem(this.storageKey);
  }

  isUserLoggedIn() {

    return localStorage.getItem(this.storageKey) != null;
  }

  signUp(values) {
    return this.http.post<User>("http://localhost:8080/api/users/add", values).toPromise()
  }

  localUser() {
    return JSON.parse(localStorage.getItem(this.storageKey))
  }
  localUserId() {
    return JSON.parse(localStorage.getItem(this.storageKey)) ? JSON.parse(localStorage.getItem(this.storageKey)).idUser : null;
  }

  containRole(role: string): boolean {
    let User: User = this.localUser();
    return (User.role.find(x => x.roleName === role)?.roleName === role);

  }


}
