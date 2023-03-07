import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { InfoDialogComponent } from 'src/app/components/dialogs/info-dialog/info-dialog.component';
import { ParkingTime } from 'src/app/models/ParkingTime';
import { Ticket, UserDashboardService, ParkingResult } from 'src/app/services/dashboards/user-dashboard.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  public tickets: Ticket[] = [];
  public ticketSubscription: Subscription = new Subscription();
  public ticketDataSource: MatTableDataSource<Ticket> = new MatTableDataSource<Ticket>(this.tickets);
  public displayedTicketColumns: string[] = ['vehiclePlateNumber', 'electricVehicle', 'parkingSpotNumber', 'parkingSpotType', 'parkingSpotWithCharger', 'timestampParkAt', 'options'];
  @ViewChild(MatPaginator, {static: false}) ticketTablePaginator: MatPaginator = null!;


  constructor(
    private userDashboardService: UserDashboardService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    public datePipe: DatePipe){}
  
    ngAfterViewInit(): void {
      this.ticketDataSource.paginator = this.ticketTablePaginator;
    }

    ngOnInit(): void {
      this.loadTickets();
    }
  
    ngOnDestroy(): void {
      this.ticketSubscription.unsubscribe();
    }

    private loadTickets(){
      this.ticketSubscription = this.userDashboardService.getTickets()
      .subscribe((data: Ticket[]) => {
        this.tickets = data;
        console.log(data);
        this.changeDetectorRef.detectChanges();
        this.ticketDataSource = new MatTableDataSource<Ticket>(this.tickets);
        this.ticketDataSource.paginator = this.ticketTablePaginator;
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
