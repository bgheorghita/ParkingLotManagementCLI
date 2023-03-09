import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/tech/authentication/auth.service';
import { ErrorHandlerService } from 'src/app/services/tech/handlers/error-handler-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
   isLoading: boolean = false;

   constructor(private errorHandler:ErrorHandlerService, private authService: AuthService, private router: Router){}
   
  public signupForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    userType: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  public submitSignupForm(){
    const username: string = this.signupForm.value.username!;
    const userType: string = this.signupForm.value.userType!;
    const password: string = this.signupForm.value.password!;

    if(!this.signupForm.valid){
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.signup(username, userType, password).subscribe(
      {
        next: () => {
          this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorHandler.handleError(error);
      },
      complete: () => {
        this.isLoading = false;
        this.router.navigate(['/user-dashboard/vehicles']);
      }
   });

    this.signupForm.reset();
  }
}
