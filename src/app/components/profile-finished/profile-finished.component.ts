import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { ProfileService } from 'src/app/services/profile.service';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-finished',
  templateUrl: './profile-finished.component.html',
  styleUrls: ['./profile-finished.component.css']
})
export class ProfileFinishedComponent implements OnInit {

  constructor(

    private eventEmitter: EventemitterService,
    private userSer: UserService,
    private profileSer: ProfileService,
    private authSer: AuthService,
    private roleSer: RoleService
  ) { }

  ngOnInit(): void {
    this.profileSer.setPage(4);
    this.updateProfile();
  }

  updateProfile() {
    this.userSer.getUserById(this.authSer.localUserId()).toPromise().then(user => {

      if (!this.authSer.containRole("SELLER")) {
        this.roleSer.getRoleByName("SELLER").toPromise().then(role => {
          user.role.push(role);
          this.userSer.updateUser(user).toPromise().catch(err=> console.log(err) )
        })
      }


      this.profileSer.getProfileByUser(user).toPromise().then(profile => {

        profile.completed = true;
        this.profileSer.updateProfile(profile).toPromise().then(data => {
          this.eventEmitter.showPopUP({ type: 'success', message: "profile has been updated" })


        }).catch(err => {
          this.eventEmitter.showPopUP({ type: 'error', message: err.error })
        })


      }).catch(err => {

        this.eventEmitter.showPopUP({ type: 'error', messsage: "Profile not found" })
      })

    }).catch(err => {
      this.eventEmitter.showPopUP({ type: 'error', message: "user cannot be found" })
    })

  }

}
