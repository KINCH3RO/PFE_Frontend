import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile-associated-accounts',
  templateUrl: './profile-associated-accounts.component.html',
  styleUrls: ['./profile-associated-accounts.component.css']
})
export class ProfileAssociatedAccountsComponent implements OnInit {

  constructor(private profileSer:ProfileService,private router:Router) { }

  ngOnInit(): void {
    this.profileSer.setPage(3);
  }

  next(){
    this.router.navigateByUrl("/profileCreation/finished")
  }

}
