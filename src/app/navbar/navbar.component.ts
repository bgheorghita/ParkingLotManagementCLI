import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy{
    public userIsAuthenticated = false;
    public username: string = '';
    private userSubscription: Subscription = new Subscription();

    constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => {
      this.userIsAuthenticated = !!user;
      if(this.userIsAuthenticated){
        this.username = user.username;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  logout(){
    this.authService.logout();
  }
}
