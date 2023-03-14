import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { UserDetails } from './user-dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  constructor(private http: HttpClient) { }
  private baseUrl: string = 'http://localhost:8080';

  getUnvalidatedUsers(): Observable<any>{
    return this.http.get<UserDetails[]>(this.baseUrl + '/api/v1/dashboard/admin/users/unvalidated').pipe(
      map((users: UserDetails[]) => {
        return users.map( (user: UserDetails) => ({
          userType: user.userType,
          vehiclePlateNumbers: user.vehiclePlateNumbers,
          username: user.username,
          isValidated: user.isValidated
      }))
      })
    );
  }

  getUsers(): Observable<any>{
    return this.http.get<UserDetails[]>(this.baseUrl + '/api/v1/dashboard/admin/users').pipe(
      map((users: UserDetails[]) => {
        return users.map( (user: UserDetails) => ({
          userType: user.userType,
          vehiclePlateNumbers: user.vehiclePlateNumbers,
          username: user.username,
          isValidated: user.isValidated
      }))
      })
    );
  }

  validateUser(username: string): Observable<any>{
    return this.http.post<string>(this.baseUrl + `/api/v1/dashboard/admin/users/validate/${username}`, {});
  }

  invalidateUser(username: string): Observable<any>{
    return this.http.post<string>(this.baseUrl + `/api/v1/dashboard/admin/users/invalidate/${username}`, {});
  }

}
