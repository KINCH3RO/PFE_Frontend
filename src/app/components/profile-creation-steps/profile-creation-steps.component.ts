import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile-creation-steps',
  templateUrl: './profile-creation-steps.component.html',
  styleUrls: ['./profile-creation-steps.component.css']
})
export class ProfileCreationStepsComponent implements OnInit {

  constructor(private router: Router, private profile: ProfileService) { }

  ngOnInit(): void {

  }

  create() {
    if (this.profile.getPageFromLocalStorage()) {
      let pageValue = parseInt(this.profile.getPageFromLocalStorage());

      switch (pageValue) {
        case 1: this.router.navigateByUrl("/profileCreation"); break;
        case 2: this.router.navigateByUrl("/profileCreation/pro"); break;
        case 3: this.router.navigateByUrl("/profileCreation/Aac"); break;




        default: this.router.navigateByUrl("/profileCreation");
          break;
      }
    } else {
      this.router.navigateByUrl("/profileCreation")
    }
  }
}
