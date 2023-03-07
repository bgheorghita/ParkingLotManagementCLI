import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe, CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';

//Angular Material Components
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ParkingLotComponent } from './parking-lot/parking-lot.component';
import { UserDashboardComponent } from './dashboards/user-dashboard/user-dashboard.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { AlertComponent } from './alert/alert/alert.component';
import { YesNoDialogComponent } from './dialogs/yesno-dialog/yesno-dialog.component';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';
import { VehiclesComponent } from './vehicles/vehicles/vehicles.component';
import { VehicleComponent } from './vehicles/vehicle/vehicle.component';
import { AddVehicleComponent } from './vehicles/add-vehicle/add-vehicle.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AccountComponent } from './accounts/account/account.component';
import { TicketsComponent } from './tickets/tickets/tickets.component';
import { ErrorHandlerService } from './services/error-handler-service.service';
import { UsersComponent } from './users/users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    SigninComponent,
    SignupComponent,
    ParkingLotComponent,
    UserDashboardComponent,
    AdminDashboardComponent,
    AlertComponent,
    YesNoDialogComponent,
    InfoDialogComponent,
    VehiclesComponent,
    VehicleComponent,
    AddVehicleComponent,
    PageNotFoundComponent,
    AccountComponent,
    TicketsComponent,
    AlertComponent,
    UsersComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, 
    DatePipe, 
    CommonModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}, 
    DatePipe, AuthGuardService, 
    { provide: ErrorHandler, useClass: ErrorHandlerService }],
  bootstrap: [AppComponent]
})
export class AppModule { }