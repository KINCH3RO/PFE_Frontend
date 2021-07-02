import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';


import { EventemitterService } from 'src/app/services/eventemitter.service';
import { ProfileService } from 'src/app/services/profile.service';


@Component({
  selector: 'app-manage-profiles',
  templateUrl: './manage-profiles.component.html',
  styleUrls: ['./manage-profiles.component.css']
})
export class ManageProfilesComponent implements OnInit {

  constructor(private profileSer: ProfileService, private eventEmitter: EventemitterService) { }

  ngOnInit(): void {
    this.displayData();
  }




  paginProfiles: Observable<any>
  pageSize: number = 4;
  pageNumber: number = 0;
  country: string = '';
  speciality: string = '';
  language: string = '';
  selectedProfileId: number = -1;
  showModal=false;


  displayData() {
    
    this.paginProfiles = this.profileSer.getProfilesFiltred(this.pageNumber, this.pageSize, this.country, this.speciality, this.language)


  }
  ShowModal(id:number){
    this.showModal=true;
    this.selectedProfileId=id;
  }

  closeModal(){
    this.showModal=false;
    this.selectedProfileId=-1;
  }

  updateProfile(status: boolean) {
    this.profileSer.getProfileById(this.selectedProfileId).toPromise().then(data => {
      data.blocked = status;
      this.profileSer.updateProfile(data).toPromise().then(data => {
        this.eventEmitter.showPopUP({ message: "Profile status has been changed", type: "success" })
        this.displayData();
      }).catch(err => {
        this.eventEmitter.showPopUP({ message: "an error occured updating profile", type: "error" })
      })
    }).catch(err => {
      this.eventEmitter.showPopUP({ message: "cannot find profile id", type: "error" })
    })
    this.closeModal();

  }


  incrementPages() {
    this.pageNumber++;
    this.displayData();
  }

  decrementPages() {
    this.pageNumber--;
    this.displayData();
  }

  filter() {

    this.displayData();
  }
}

