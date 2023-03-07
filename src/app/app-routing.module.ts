import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './components/authentication/signin/signin.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { ParkingLotComponent } from './components/parking-lot/parking-lot.component';
import { UserDashboardComponent } from './components/dashboards/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './components/dashboards/admin-dashboard/admin-dashboard.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { AddVehicleComponent } from './components/vehicles/add-vehicle/add-vehicle.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuardService } from './services/guards/auth-guard.service';
import { AccountComponent } from './components/accounts/account/account.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { VehicleComponent } from './components/vehicles/vehicle/vehicle.component';
import { UsersComponent } from './components/users/users.component';
import { AuthorizationGuard } from './services/guards/authorization-guard.guard';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'parking-lot', component: ParkingLotComponent},
  {path: 'not-found', component: PageNotFoundComponent},
  {path: 'not-authorized', component: NotAuthorizedComponent},
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
