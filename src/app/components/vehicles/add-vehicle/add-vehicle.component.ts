import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InfoDialogComponent } from 'src/app/components/dialogs/info-dialog/info-dialog.component';
import { UserDashboardService } from 'src/app/services/bussiness/dashboards/user-dashboard.service';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit, OnDestroy{
   public plateNumber: string = '';
   private paramsSubscription = new Subscription();
 
   constructor(private userDashboardService: UserDashboardService, 
     public dialog: MatDialog,
     public datePipe: DatePipe,
     private activatedRoute: ActivatedRoute,
     private router: Router){}
 
   ngOnInit(): void {
     this.plateNumber = this.activatedRoute.snapshot.params['plateNumber'];
     this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
       this.plateNumber = params['plateNumber'];
     })
   }
 
   ngOnDestroy(): void {
     this.paramsSubscription.unsubscribe();
   }
 
   public addVehicleForm = new FormGroup({
     vehiclePlateNumber: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern('^\\S+$')]),
     vehicleType: new FormControl('', [Validators.required]),
     electricVehicle: new FormControl('', [Validators.required])
   });
 
   public submitAddVehicleForm(){
     console.log(this.addVehicleForm.value);
     const vehiclePlateNumber: string = this.addVehicleForm.value.vehiclePlateNumber!;
     const vehicleType: string = this.addVehicleForm.value.vehicleType!;
     const electricVehicle: string = this.addVehicleForm.value.electricVehicle!;
 
    if(!this.addVehicleForm.valid){
      this.addVehicleForm.markAllAsTouched();
      return;
    }


     this.userDashboardService.addVehicle({
       vehicleType: vehicleType,
       plateNumber: vehiclePlateNumber,
       isElectric: electricVehicle === 'true',
       isParked: false
     }).subscribe({
       complete: () => {
         const dialogRef = this.dialog.open(InfoDialogComponent, {
           width: '350px',
           data: {
             title: "Info", 
             mainContent: `${vehiclePlateNumber} successfully added`,
           }
         });
        
         dialogRef.afterClosed().subscribe(result => {
           this.addVehicleForm.reset();
           this.router.navigate(['..', vehiclePlateNumber], {relativeTo: this.activatedRoute});
         });
       }
     });
   }
}
