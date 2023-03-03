import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  isLoading: boolean = false;
  error:string = '';

  public signinForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, private router: Router){}

  submitSigninForm(){
    this.error = '';
    console.log(this.signinForm.value);
    const username: string = this.signinForm.value.username!;
    const password: string = this.signinForm.value.password!;

    console.log("username: " + username);
    console.log("pass: " + password);

    this.isLoading = true;
    this.authService.signin(username, password).subscribe(
      {
        next: (response) => {
          console.log("response: ");
          console.log(response);
          this.isLoading = false;
          this.router.navigate(['/user-dashboard/vehicles']);
      },
      error: (error) => {
        console.log("error...");
        console.log(error);
        this.error = error;
        this.isLoading = false;
      },
      complete: () => {
        console.log("completed");
        this.isLoading = false;
      }
   });

    this.signinForm.reset();
  }
}
