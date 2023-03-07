import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { InfoDialogComponent } from 'src/app/components/dialogs/info-dialog/info-dialog.component';
import { AdminDashboardService } from 'src/app/services/dashboards/admin-dashboard.service';
import { UserDetails } from 'src/app/services/dashboards/user-dashboard.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements AfterViewInit, OnInit, OnDestroy {
  constructor(private adminDashboardService: AdminDashboardService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog){}

  public userDetails: UserDetails[] = [];
  userDetailsSubscription: Subscription = new Subscription();
  userDetailsTableColumns: string[] = ['username', 'userType', 'vehiclePlateNumbers', 'isValidated', 'options'];
  userDetailsDataSource = new MatTableDataSource<UserDetails>(this.userDetails);
  @ViewChild(MatPaginator) userDetailsPaginator: MatPaginator = null!;

  ngAfterViewInit() {
    this.userDetailsDataSource.paginator = this.userDetailsPaginator;
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

  public loadUsers(){
    this.userDetailsSubscription = this.adminDashboardService.getUsers().subscribe(userDetails => {
      this.userDetails = userDetails;
      this.changeDetectorRef.detectChanges();
      this.userDetailsDataSource = new MatTableDataSource<UserDetails>(this.userDetails);;
      this.userDetailsDataSource.paginator = this.userDetailsPaginator;
      this.userDetailsDataSource.filterPredicate = (data: UserDetails, filter: string) => {
        return data.username.toLocaleLowerCase().includes(filter.toLocaleLowerCase());
      }
    });    
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  public validateUser(username: string){
    this.adminDashboardService.validateUser(username).subscribe(
      {
        complete: () => {
          const dialogRef = this.dialog.open(InfoDialogComponent, {
            width: '350px',
            data: {
              title: "Info", 
              mainContent: `You have successfully validated '${username}'`,
            }
          });
      
          dialogRef.afterClosed().subscribe( () => {
            this.loadUsers()
          });
        }
      }
    );
  }

  public invalidateUser(username: string){
    this.adminDashboardService.invalidateUser(username).subscribe(
      {
        complete: () => {
          const dialogRef = this.dialog.open(InfoDialogComponent, {
            width: '350px',
            data: {
              title: "Info", 
              mainContent: `You have successfully invalidated '${username}'`,
            }
          });
      
          dialogRef.afterClosed().subscribe( () => {
            this.loadUsers()
          });
        }
      }
    );
  }
}
