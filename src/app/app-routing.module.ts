import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ParkingLotComponent } from './parking-lot/parking-lot.component';
import { UserDashboardComponent } from './dashboards/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { VehiclesComponent } from './vehicles/vehicles/vehicles.component';
import { AddVehicleComponent } from './vehicles/add-vehicle/add-vehicle.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AccountComponent } from './accounts/account/account.component';
import { TicketsComponent } from './tickets/tickets/tickets.component';
import { VehicleComponent } from './vehicles/vehicle/vehicle.component';
import { UsersComponent } from './users/users/users.component';
import { AuthorizationGuard } from './services/authorization-guard.guard';

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
        path: 'vehicles/:plateNumber',
        component: VehicleComponent
      },
      {
        path: 'tickets',
        component: TicketsComponent
      },
      {
        path: 'account',
        component: AccountComponent
      }
    ]
  },
  { path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthorizationGuard],
    children: [
      { path: 'users', component: UsersComponent }
    ]
  },
  {path: '', component: HomeComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
