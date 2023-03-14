import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../tech/authentication/auth.service';

export interface Vehicle{
  vehicleType: string,
  plateNumber: string,
  isElectric: boolean,
  isParked: boolean
}

export interface Ticket{
  vehiclePlateNumber: string,
  isElectricVehicle: boolean,
  parkingSpotNumber: string,
  parkingSpotType: string,
  isParkingSpotWithElectricCharger: boolean,
  timestampParkAt: Date
}

export interface UserDetails{
  userType: string,
  vehiclePlateNumbers: [],
  username: string,
  isValidated: boolean
}

export interface Price{
  units: string,
  currency: string
}

export interface ParkingResult{
  price: Price,
  parkingTimeInMinutes: number
}

@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {

  constructor(private http: HttpClient, private authService: AuthService) { }
  private baseUrl: string = 'http://localhost:8080';

  getVehicles() : Observable<any>{
    console.log("get");
    return this.http.get<Vehicle[]>(this.baseUrl + '/api/v1/dashboard/user/vehicle').pipe(
      map((vehicles) => {
        console.log(vehicles);
        return vehicles.map((vehicle : Vehicle) => (
          {
            vehicleType: vehicle.vehicleType,
            plateNumber: vehicle.plateNumber,
            isElectric: vehicle.isElectric,
            isParked: vehicle.isParked
          }
        ))
      } )
    )
  }

  getTickets() : Observable<any>{
    return this.http.get<Ticket[]>(this.baseUrl + '/api/v1/dashboard/user/tickets').pipe(
      map((tickets) => {
        console.log(tickets);
        return tickets.map((ticket: Ticket) => (
          {
            vehiclePlateNumber: ticket.vehiclePlateNumber,
            isElectricVehicle: ticket.isElectricVehicle,
            parkingSpotNumber: ticket.parkingSpotNumber,
            parkingSpotType: ticket.parkingSpotType,
            isParkingSpotWithElectricCharger: ticket.isParkingSpotWithElectricCharger,
            timestampParkAt: ticket.timestampParkAt
          }
          ))
        }
    ))
  }

  getUserDetails(): Observable<any>{
    return this.http.get<UserDetails>(this.baseUrl + '/api/v1/dashboard/user/account');
  }

  park(plateNumber: string) : Observable<any>{
    return this.http.post<Ticket>(this.baseUrl + `/api/v1/lot/in/${plateNumber}`, {}).pipe(
      map( (ticket: Ticket) => {
        return ({
            vehiclePlateNumber: ticket.vehiclePlateNumber,
            parkingSpotNumber: ticket.parkingSpotNumber,
            parkingSpotType: ticket.parkingSpotType,
            timestampParkAt: ticket.timestampParkAt
        })
      })
    )
  }

  addVehicle(vehicle: Vehicle){
    console.log(vehicle);
      return this.http.post<Vehicle>(this.baseUrl + '/api/v1/dashboard/user/vehicle/', {
        vehicleType: vehicle.vehicleType,
        plateNumber: vehicle.plateNumber,
        isElectric: vehicle.isElectric
      });
  }
  
  removeVehicle(plateNumber: string){
    return this.http.delete<Vehicle>(this.baseUrl + `/api/v1/dashboard/user/vehicle/${plateNumber}`);
  }

  leaveParkingSpot(vehiclePlateNumber: string){
    return this.http.post<ParkingResult>(this.baseUrl + `/api/v1/lot/out/${vehiclePlateNumber}`, {});
  }

}
