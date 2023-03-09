import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, Observable } from 'rxjs';
import { UserDashboardService, Vehicle } from 'src/app/services/bussiness/dashboards/user-dashboard.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit, OnDestroy, AfterViewInit {

  public vehicles: Vehicle[] = [];
  vehicleSubscription: Subscription = new Subscription();
  vehicleObserver: Observable<any> = new Observable();
  vehicleDataSource: MatTableDataSource<Vehicle> = new MatTableDataSource<Vehicle>(this.vehicles);
  @ViewChild(MatPaginator) vehicleTablePaginator: MatPaginator = null!;
  
  constructor(private userDashboardService: UserDashboardService, 
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    public datePipe: DatePipe){}

    ngAfterViewInit(): void {
      this.vehicleDataSource.paginator = this.vehicleTablePaginator;
    }
  
    ngOnInit(): void {
      this.loadVehicles();
    }
  
    ngOnDestroy(): void {
      this.vehicleSubscription.unsubscribe();
      if (this.vehicleDataSource) { 
        this.vehicleDataSource.disconnect(); 
      }
    }

  private loadVehicles(){
    this.vehicleSubscription = this.userDashboardService.getVehicles()
      .subscribe( (data : Vehicle[] ) => {
          this.vehicles = data;
          this.changeDetectorRef.detectChanges();
          this.vehicleDataSource = new MatTableDataSource<Vehicle>(this.vehicles);
          this.vehicleDataSource.paginator = this.vehicleTablePaginator;
          this.vehicleObserver = this.vehicleDataSource.connect();
    });
  }

}
