import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ParkingResult, Price, Ticket, UserDashboardService, UserDetails, Vehicle } from '../../services/user-dashboard.service';
import { DatePipe, CommonModule } from '@angular/common';
import { YesNoDialogComponent } from 'src/app/dialogs/yesno-dialog/yesno-dialog.component';
import { InfoDialogComponent } from 'src/app/dialogs/info-dialog/info-dialog.component';
import { ParkingTime } from 'src/app/models/ParkingTime';
import { MatTabChangeEvent, MatTabNavPanel } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, OnDestroy, AfterViewInit{
  @Output()
  selectedTabChange: EventEmitter<MatTabChangeEvent> = null!; 
  private selectedTabIndex = 0;

  public tickets: Ticket[] = [];
  ticketSubscription: Subscription = new Subscription();
  ticketDataSource: MatTableDataSource<Ticket> = new MatTableDataSource<Ticket>(this.tickets);
  displayedTicketColumns: string[] = ['vehiclePlateNumber', 'parkingSpotNumber', 'parkingSpotType', 'timestampParkAt', 'options'];
  @ViewChild(MatPaginator, {static: true}) ticketTablePaginator: MatPaginator = null!;

  public vehicles: Vehicle[] = [];
  vehicleSubscription: Subscription = new Subscription();
  vehicleObserver: Observable<any> = new Observable();
  vehicleDataSource: MatTableDataSource<Vehicle> = new MatTableDataSource<Vehicle>(this.vehicles);
  @ViewChild(MatPaginator) vehicleTablePaginator: MatPaginator = null!;

  public userDetails: UserDetails = null!;
  userDetailsSubscription: Subscription = new Subscription();

  error: string = '';
  panel: MatTabNavPanel|undefined;

  constructor(private userDashboardService: UserDashboardService, 
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private activatedRoute: ActivatedRoute){}

  ngAfterViewInit(): void {
    this.ticketDataSource.paginator = this.ticketTablePaginator;
    this.vehicleDataSource.paginator = this.vehicleTablePaginator;
  }

  ngOnInit(): void {
    this.loadVehicles();
    this.loadTickets();
    this.loadUserDetails();
  }

  ngOnDestroy(): void {
    this.vehicleSubscription.unsubscribe();
    if (this.vehicleDataSource) { 
      this.vehicleDataSource.disconnect(); 
    }

    this.ticketSubscription.unsubscribe();
    this.userDetailsSubscription.unsubscribe();
  }

  public active(changeEvent: MatTabChangeEvent){
    this.selectedTabIndex = changeEvent.index;
    console.log(this.selectedTabIndex);
    console.log(changeEvent);
    if(this.selectedTabIndex == 0){
      
      // this.router.navigate(['/user-dashboard/vehicles']);
    //  this.router.navigate(['/user-dashboard/vehicles'], {relativeTo: this.activatedRoute});
      changeEvent.tab.isActive=true;
    } else if(this.selectedTabIndex == 1){
      
      // this.router.navigate(['/user-dashboard/tickets']);
      this.router.navigate(['/user-dashboard/tickets'], {relativeTo: this.activatedRoute});
      changeEvent.tab.isActive=true;
    } else if(this.selectedTabIndex == 2){
      
      // this.router.navigate(['/user-dashboard/account']);
      this.router.navigate(['/user-dashboard/account'], {relativeTo: this.activatedRoute});

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

  private loadTickets(){
    this.ticketSubscription = this.userDashboardService.getTickets()
    .subscribe((data: Ticket[]) => {
      this.tickets = data;
      this.ticketDataSource = new MatTableDataSource<Ticket>(this.tickets);
      this.ticketDataSource.paginator = this.ticketTablePaginator;
    });
  }

  private loadUserDetails(){
    this.userDetailsSubscription = this.userDashboardService.getUserDetails()
        .subscribe((data: UserDetails) => {
          this.userDetails = data;
    });
  }

  public addVehicleForm = new FormGroup({
    vehiclePlateNumber: new FormControl('', [Validators.required, Validators.minLength(4)]),
    vehicleType: new FormControl('', [Validators.required]),
    electricVehicle: new FormControl('', [Validators.required])
  });

  public submitAddVehicleForm(){
    console.log(this.addVehicleForm.value);
    this.error = '';
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
          this.loadUserDetails();
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
            this.loadUserDetails();
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
          this.loadTickets();
        });
      }
    });
  }

  public openPayDialog(vehiclePlateNumber: string){
    let parkingResult: ParkingResult = null!;

    this.userDashboardService.leaveParkingSpot(vehiclePlateNumber)
    .subscribe({
      next: (_parkingResult) => {
        console.log(_parkingResult);
        parkingResult = _parkingResult;
      },
      error: (e) => {},
      complete: () => {
        const parkingTime: ParkingTime = this.getParkingTime(parkingResult.parkingTimeInMinutes);

        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: '350px',
          data: {
            title: "Thank you!", 
            mainContent: `Parking duration: ${parkingTime.hours} hours ${parkingTime.minutes} minutes`,
            secondContent: `Price:  ${parseFloat(parkingResult.price.units).toFixed(2)} ${parkingResult.price.currency}`
          }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          this.loadTickets();
          this.loadVehicles();
        });
      }
    });
  }

  private getParkingTime(parkingTimeInMinutes: number) : ParkingTime{
    let hours = Math.floor(parkingTimeInMinutes / 60);
    const minutes = parkingTimeInMinutes % 60;
    return new ParkingTime(hours, minutes);
  }

}
