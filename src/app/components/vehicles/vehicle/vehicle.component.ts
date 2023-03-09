import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InfoDialogComponent } from 'src/app/components/dialogs/info-dialog/info-dialog.component';
import { YesNoDialogComponent } from 'src/app/components/dialogs/yesno-dialog/yesno-dialog.component';
import { ErrorHandlerService } from 'src/app/services/tech/handlers/error-handler-service.service';
import { UserDashboardService, Vehicle } from 'src/app/services/bussiness/dashboards/user-dashboard.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit, OnDestroy{

  public vehicle: Vehicle = null!;
  vehicleSubscription: Subscription = new Subscription();

constructor(private errorHandler:ErrorHandlerService, private activatedRoute: ActivatedRoute, 
   private router: Router,
   private userDashboardService: UserDashboardService,
   public dialog: MatDialog){}

  public plateNumber: string = '';
  private activatedRouteSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.activatedRouteSubscription = this.activatedRoute.params.subscribe(
      {
        next: (params: Params) => {
          this.vehicle = null!;
          this.plateNumber = params['plateNumber'];
          if(this.plateNumber){
            this.loadVehicle(this.plateNumber);
          }
        },
        error: (e) => {},
        complete: () => {}
      }
    );
  }

  ngOnDestroy(): void {
    this.activatedRouteSubscription.unsubscribe();
    this.vehicleSubscription.unsubscribe();
  }

  private loadVehicle(plateNumber: string){
    this.vehicleSubscription = this.userDashboardService.getVehicles().subscribe( (vehicle : Vehicle[]) => {
      vehicle.forEach(vehicle => {
        console.log(vehicle.plateNumber);
        if(vehicle.plateNumber === plateNumber){
          this.vehicle = vehicle;
          return;
        }
      })
    })
  }
 

  openRemoveVehicleDialog(vehiclePlateNumber: string): void {
    const dialogRef = this.dialog.open(YesNoDialogComponent, {
      width: '350px',
      data: {title: "Remove " + vehiclePlateNumber + '?', content: 'The vehicle will be removed from your account.'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'Yes'){
        this.userDashboardService.removeVehicle(vehiclePlateNumber).subscribe({
          // next: (vehicle) => {},
          // error: (e) => {this.errorHandler.handleError(e.error);},
          complete: () => {
            this.router.navigate(['..'], {relativeTo: this.activatedRoute});
          }
        });
      }
    });
  }

  public park(plateNumber: string){
    this.userDashboardService.park(plateNumber).subscribe({
      //next: (val) => {},
      // error: (e) => {
      //   console.log(e);
      //    this.errorHandler.handleError(e.error);
      // },
      complete: () => {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
          width: '350px',
          data: {
            title: "Info", 
            mainContent: `${plateNumber} successfully parked`,
            secondContent: `In the section of the \"Tickets\" you can see and pay your tickets.`
          }
        });
       
        dialogRef.afterClosed().subscribe(result => {
          this.router.navigate(['../../tickets'], {relativeTo: this.activatedRoute});
        });
      }
    });
  }


}
