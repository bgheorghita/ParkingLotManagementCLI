import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserDashboardService, UserDetails } from 'src/app/services/user-dashboard.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy{

  public userDetails: UserDetails = null!;
  userDetailsSubscription: Subscription = new Subscription();

  constructor(private userDashboardService: UserDashboardService,
    public dialog: MatDialog,
    public datePipe: DatePipe){}

    ngOnInit(): void {
      this.loadUserDetails();
    }
  
    ngOnDestroy(): void {
      this.userDetailsSubscription.unsubscribe();
    }

    private loadUserDetails(){
      this.userDetailsSubscription = this.userDashboardService.getUserDetails()
          .subscribe((data: UserDetails) => {
            this.userDetails = data;
      });
    }
}


