import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
   isLoading: boolean = false;
   error:string = '';

   constructor(private authService: AuthService, private router: Router){}
   

  public signupForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    userType: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  public submitSignupForm(){
    this.error = '';
    console.log(this.signupForm.value);
    const username: string = this.signupForm.value.username!;
    const userType: string = this.signupForm.value.userType!;
    const password: string = this.signupForm.value.password!;

    console.log("username: " + username);
    console.log("user: " + userType);
    console.log("pass: " + password);

    this.isLoading = true;
    this.authService.signup(username, userType, password).subscribe(
      {
        next: (response) => {
          console.log("response: ");
          console.log(response);
          this.isLoading = false;
          this.router.navigate(['/user-dashboard']);
      },
      error: (error) => {
        console.log(error);
        this.error = error;
        this.isLoading = false;
      },
      complete: () => {
        console.log("completed");
        this.isLoading = false;
      }
   });

    this.signupForm.reset();
  }
}
