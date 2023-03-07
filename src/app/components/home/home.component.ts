import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/authentication/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  constructor(private authService: AuthService, private route: Router, private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    const user = this.authService.user.getValue();
    if(!user){
      this.route.navigate(['signin'], {relativeTo: this.activatedRoute});
      return;
    }

    if(user.roles.includes("ADMIN")){
      this.route.navigate(['admin-dashboard'], {relativeTo: this.activatedRoute});
    } else {
      this.route.navigate(['user-dashboard'], {relativeTo: this.activatedRoute});
    }
  }

}
