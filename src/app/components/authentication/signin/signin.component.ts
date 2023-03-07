import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ErrorHandlerService } from 'src/app/services/handlers/error-handler-service.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  isLoading: boolean = false;

  public signinForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required)
  });

  constructor(private errorHandler: ErrorHandlerService, private authService: AuthService, private router: Router, public dialog: MatDialog){}

  submitSigninForm(){
    console.log(this.signinForm.value);
    const username: string = this.signinForm.value.username!;
    const password: string = this.signinForm.value.password!;

    if(!this.signinForm.valid){
      this.signinForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.signin(username, password).subscribe(
      {
      next: () => {
        this.isLoading = false;
      },
      error: (e) => {
        this.isLoading = false;
        this.errorHandler.handleError(e);
      },
      complete: () => {
        this.isLoading = false;
        if(this.authService.user.getValue().roles.includes("ADMIN")){
          this.router.navigate(['/admin-dashboard/users']);
        } else {
          this.router.navigate(['/user-dashboard/vehicles']);
        }
      }
   });

    this.signinForm.reset();
  }
}