import { state, style, trigger } from '@angular/animations';
import { Component, OnChanges, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
 

})
export class NavbarComponent implements OnInit  {

 
  constructor(private fb:FormBuilder,public auth:AuthService,private profileSer:ProfileService) { }

 

  image=false;
  isPrimary=true;
  opacity=1;
  display="flex"
  profile=false;
  show =true;
  showNavBar=true;
  hasProfile=false;
  

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
    this.auth.isUserLogged.subscribe(data=>{
      this.profile=data;
    });

    let  u:User =new User();
    u.idUser=this.auth.localUserId();
    if(u.idUser == null){
      return;
    }
    this.profileSer.getProfileByUser(u).toPromise().then(data=>{
        this.hasProfile=data.completed;
    }).catch(err=>{

    })



  }
  
}
