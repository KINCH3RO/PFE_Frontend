import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile-creation-wizard',
  templateUrl: './profile-creation-wizard.component.html',
  styleUrls: ['./profile-creation-wizard.component.css']
})
export class ProfileCreationWizardComponent implements OnInit {

   pageNumber:number=0;

  constructor(private router:Router,private profileSer :ProfileService,private cd:ChangeDetectorRef) { 
   
  }

  ngOnInit(): void {
    
    this.profileSer.pageNumber.subscribe(data=>{
      this.pageNumber=data;
       console.log(this.pageNumber)
       this.cd.detectChanges()
   })
  }


}
