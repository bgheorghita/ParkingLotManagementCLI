import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ParkingLotComponent } from './parking-lot/parking-lot.component';
import { UserDashboardComponent } from './dashboards/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { ShowTicketsComponent } from './dashboards/user-dashboard/tickets/show-tickets/show-tickets.component';
import { ShowAccountComponent } from './dashboards/user-dashboard/accounts/show-account/show-account.component';
import { VehiclesComponent } from './vehicles/vehicles/vehicles.component';
import { AddVehicleComponent } from './vehicles/add-vehicle/add-vehicle.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'parking-lot', component: ParkingLotComponent},
  {path: 'not-found', component: PageNotFoundComponent},
  {
    path: 'user-dashboard', 
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    component: UserDashboardComponent,
    children: [
      {
        path: 'vehicles',
        component: VehiclesComponent,
      },
      {
        path: 'vehicles/add',
        component: AddVehicleComponent
      },
      {
        path: 'tickets',
        component: ShowTicketsComponent
      },
      {
        path: 'account',
        component: ShowAccountComponent
      }
    ]
  },
  {path: 'admin-dashboard', component: AdminDashboardComponent},
  {path: '', component: HomeComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
