import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { User } from '../../models/User';
import jwt_decode from "jwt-decode";

export interface Token{
  roles: string[],
  userType: string,
  sub: string,
  iat: string,
  exp: string,
  validated: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null!);

  constructor(private http: HttpClient, private router: Router){}

  private tokenExpirationTimer: any;

  signup(username: string, userType: string, password: string){
    return this.http.post('http://localhost:8080/api/v1/auth/register', {
      username: username,
      userType: userType,
      password: password
    },{responseType: 'text'})
    .pipe(catchError((e) => this.errorHandling(e)), tap(response => {
         this.authenticationHandler(response);
    }));
  }

  signin(username: string, password: string){
    return this.http.post('http://localhost:8080/api/v1/auth/authenticate', {
      username: username,
      password: password
    }, {responseType: 'text'})
    .pipe(catchError((e) => this.errorHandling(e)), tap(response => {
      this.authenticationHandler(response);
    }));
  }

  private getDecodedToken(token: string): Token {
    return jwt_decode(token);
  }

  private authenticationHandler(token: string){
    const decodedToken = this.getDecodedToken(token);
    const tokenExpDateInMillis = Number(decodedToken.exp)*1000;
    console.log(decodedToken.validated);
    const user = new User(decodedToken.sub, decodedToken.userType, decodedToken.roles, token, tokenExpDateInMillis.toString(), decodedToken.validated);
    this.user.next(user);
    this.autoLogout(tokenExpDateInMillis - new Date().getTime());
    localStorage.setItem('user', JSON.stringify(user));
  }

  private errorHandling(e: HttpErrorResponse){
     //ErrorHandlerService can be used to display custom message error
     return throwError(() => e);
  } 

  logout(){
    this.user.next(null!);
    this.router.navigate(['/signin']);
    localStorage.removeItem('user');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(tokenExpirationDateInMillis: number){ 
    this.tokenExpirationTimer = setTimeout(() => this.logout(), tokenExpirationDateInMillis)
  }

  autoLogin(){
    const user = localStorage.getItem('user');
    if(!user){
      return;
    }
    const userObj: {
      _username: string,
      _userType: string,
      _roles: string[],
      _token: string,
      _tokenExpirationDateInMillis: string,
      _isValidatedAccount: boolean
    } = JSON.parse(user);

    if(!userObj._token){
      return;
    }
    const loadedUser = new User(userObj._username, userObj._userType, userObj._roles, userObj._token, userObj._tokenExpirationDateInMillis, userObj._isValidatedAccount);
    console.log(loadedUser);
    this.user.next(loadedUser);
    this.autoLogout(Number(userObj._tokenExpirationDateInMillis) - new Date().getTime());
  }
}