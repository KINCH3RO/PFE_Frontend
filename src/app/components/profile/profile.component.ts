import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Profile } from 'src/app/models/profile';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private profileService: ProfileService,
    private activatedRoute: ActivatedRoute,
    private eventEmitter: EventemitterService,
    private auth: AuthService) { }

  profile: Profile;
  showEditButton=false;

  ngOnInit(): void {
    let userId = 0;
    let paramValue = this.activatedRoute.snapshot.paramMap.get("id")
   
    if (paramValue != null) {
      userId = parseInt(paramValue)
    }

    
    if (!userId) {
      userId = this.auth.localUserId();
    }

    let u = new User();

    u.idUser = userId;

    this.profileService.getProfileByUser(u).toPromise().then(data => {
      if (data.completed) {
        this.profile = data;
        this.showEditButton =(this.auth.localUserId()==this.profile.user.idUser)
      } else {
        this.eventEmitter.showPopUP({ type: "error", message: "Sorry this profile is not completed" })
      }


    }).catch(err => {
      this.eventEmitter.showPopUP({ type: "error", message: "Profile not found" })
      console.log(err.error);
      
    })
  }

}
