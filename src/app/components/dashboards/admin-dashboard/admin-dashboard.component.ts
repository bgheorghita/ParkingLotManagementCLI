import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AdminDashboardService } from 'src/app/services/bussiness/dashboards/admin-dashboard.service';
import { UserDetails } from 'src/app/services/bussiness/dashboards/user-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminDashboardComponent implements AfterViewInit, OnDestroy{
  constructor(private adminDashboardService: AdminDashboardService){}

  public userDetails: UserDetails[] = [];
  userDetailsSubscription: Subscription = new Subscription();
  userDetailsTableColumns: string[] = ['username', 'userType', 'isValidated'];
  columnsToDisplayWithExpand = [...this.userDetailsTableColumns, 'expand'];
  expandedElement: UserDetails | null = null;
  userDetailsDataSource = new MatTableDataSource<UserDetails>(this.userDetails);
  @ViewChild(MatPaginator) userDetailsPaginator: MatPaginator = null!;
  @ViewChild(MatSort) userDetailsSort: MatSort = null!;

  ngAfterViewInit() {
    this.userDetailsDataSource.paginator = this.userDetailsPaginator;
    this.userDetailsDataSource.sort = this.userDetailsSort;
  }

  ngOnDestroy(): void {
    this.userDetailsSubscription.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userDetailsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.userDetailsDataSource.paginator) {
      this.userDetailsDataSource.paginator.firstPage();
    }
  }

  public usersViewActivated:boolean = false;
  public vehiclesViewActivated: boolean = false;

  public activateUsersView(){
    this.usersViewActivated = true;
    this.vehiclesViewActivated = false;
  }

  public activateVehiclesView(){
    this.vehiclesViewActivated = true;
    this.usersViewActivated = false;
  }

  public showUsers(){
    this.activateUsersView();

    this.userDetailsSubscription = this.adminDashboardService.getUnvalidatedUsers().subscribe(userDetails => {
      this.userDetails = userDetails;
      this.userDetailsDataSource = new MatTableDataSource<UserDetails>(this.userDetails);
      this.userDetailsDataSource.paginator = this.userDetailsPaginator;
    });    
  }

}
