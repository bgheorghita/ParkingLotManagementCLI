import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { UserDetails } from './user-dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  constructor(private http: HttpClient) { }

  getUnvalidatedUsers(): Observable<any>{
    return this.http.get<UserDetails[]>('http://localhost:8080/api/v1/dashboard/admin/users/unvalidated').pipe(
      map((users: UserDetails[]) => {
        return users.map( (user: UserDetails) => ({
          userType: user.userType,
          vehiclePlateNumbers: user.vehiclePlateNumbers,
          username: user.username,
          isValidated: user.isValidated
      }))
      })
    )
  }

}
