import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private userS:UserService,private eventEmitter:EventemitterService,private auth:AuthService,) { }

  ngOnInit(): void {
    this.activatedRoute.snapshot.paramMap.get('currentView')
    this.userS.getUserById(this.auth.localUser().idUser).toPromise().then(data => {
      
      this.currentAdminUser = data;
      this.eventEmitter.showPopUP({ type: "info", message: "Welcome " + this.currentAdminUser.name })
    }).catch(err => {
      this.eventEmitter.showPopUP({ type: "error", message: err.error })
    })
  }
  currentAdminUser:User;

 
}
