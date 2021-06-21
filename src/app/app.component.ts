import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'PFE';
  constructor(private auth:AuthService,private profileSer:ProfileService){

  }
  ngOnInit(): void {
   
    this.auth.isUserLogged.next(this.auth.isUserLoggedIn())
    this.profileSer.getPage();
    
    
  }
}
