import { state, style, trigger } from '@angular/animations';
import { Component, OnChanges, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
 

})
export class NavbarComponent implements OnInit  {

 
  constructor(private fb:FormBuilder,private auth:AuthService) { }

 

  image=false;
  isPrimary=true;
  opacity=1;
  display="flex"
  profile=false;
  show =true;
  showNavBar=true;
  

  logout(){
    this.auth.logout()
  }
  toggle(){
   
    this.show=!this.show;
  }

  toggleNavbar(){
   
    this.showNavBar=!this.showNavBar;
  }
  ngOnInit(): void {

    if(this.auth.isUserLoggedIn()){
      this.auth.isUserLogged.next(true)
    }
    this.auth.isUserLogged.subscribe( value => {
      this.profile = value;
  });

  }
  
}
