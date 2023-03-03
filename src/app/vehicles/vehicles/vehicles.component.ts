import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { InfoDialogComponent } from 'src/app/dialogs/info-dialog/info-dialog.component';
import { YesNoDialogComponent } from 'src/app/dialogs/yesno-dialog/yesno-dialog.component';
import { UserDashboardService, Vehicle } from 'src/app/services/user-dashboard.service';

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
    private router: Router,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private activatedRoute: ActivatedRoute){}

    ngAfterViewInit(): void {
      //this.ticketDataSource.paginator = this.ticketTablePaginator;
      this.vehicleDataSource.paginator = this.vehicleTablePaginator;
    }
  
    ngOnInit(): void {
      this.loadVehicles();
      //this.loadTickets();
      //this.loadUserDetails();
    }
  
    ngOnDestroy(): void {
      this.vehicleSubscription.unsubscribe();
      if (this.vehicleDataSource) { 
        this.vehicleDataSource.disconnect(); 
      }
  
      //this.ticketSubscription.unsubscribe();
      //this.userDetailsSubscription.unsubscribe();
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

  public addVehicleForm = new FormGroup({
    vehiclePlateNumber: new FormControl('', [Validators.required, Validators.minLength(4)]),
    vehicleType: new FormControl('', [Validators.required]),
    electricVehicle: new FormControl('', [Validators.required])
  });

  public submitAddVehicleForm(){
    console.log(this.addVehicleForm.value);
    //this.error = '';
    const vehiclePlateNumber: string = this.addVehicleForm.value.vehiclePlateNumber!;
    const vehicleType: string = this.addVehicleForm.value.vehicleType!;
    const electricVehicle: string = this.addVehicleForm.value.electricVehicle!;

    this.userDashboardService.addVehicle({
      vehicleType: vehicleType,
      plateNumber: vehiclePlateNumber,
      isElectric: electricVehicle === 'true',
      isParked: false
    }).subscribe({
      next: (vehicle) => {},
      error: (e) => {},
      complete: () => {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: '350px',
          data: {
            title: "Info", 
            mainContent: `${vehiclePlateNumber} successfully added`,
          }
        });
       
        dialogRef.afterClosed().subscribe(result => {
          this.loadVehicles();
          //this.loadUserDetails();
          this.addVehicleForm.reset();
        });
      }
    });
  }

  openRemoveVehicleDialog(vehiclePlateNumber: string): void {
    const dialogRef = this.dialog.open(YesNoDialogComponent, {
      width: '350px',
      data: {title: "Remove " + vehiclePlateNumber + '?', content: 'The vehicle will be removed from your account.'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'Yes'){
        this.userDashboardService.removeVehicle(vehiclePlateNumber).subscribe({
          next: (vehicle) => {},
          error: (e) => {},
          complete: () => {
            this.loadVehicles();
            //this.loadUserDetails();
          }
        });
      }
    });
  }


  private refreshPage(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/user-dashboard']);
    });
  }

  public park(plateNumber: string){
    this.userDashboardService.park(plateNumber).subscribe({
      next: (val) => {},
      error: (e) => {},
      complete: () => {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: '350px',
          data: {
            title: "Info", 
            mainContent: `${plateNumber} successfully parked`,
            secondContent: `You can go to the \"Tickets\" section to check and pay your tickets.`
          }
        });
       
        dialogRef.afterClosed().subscribe(result => {
          this.loadVehicles();
          //this.loadTickets();
        });
      }
    });
  }



  public add(){
    this.router.navigate(['add'], {relativeTo: this.activatedRoute});
  }
}
