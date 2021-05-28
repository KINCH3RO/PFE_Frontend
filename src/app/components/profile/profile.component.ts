import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from 'src/app/models/profile';
import { User } from 'src/app/models/user';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private profileService:ProfileService) { }

  profile:Profile;

  ngOnInit(): void {
    let u = new User();
    
    u.idUser=1;
    
   this.profileService.getProfileByUser(u).toPromise().then(data=>{
       this.profile=data;
       console.log(this.profile);
       
    })
  }

}
