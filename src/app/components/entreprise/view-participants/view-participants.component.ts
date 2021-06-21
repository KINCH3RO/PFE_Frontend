import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-view-participants',
  templateUrl: './view-participants.component.html',
  styleUrls: ['./view-participants.component.css']
})
export class ViewParticipantsComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private profileSer: ProfileService,
    private entrepriseSer: EntrepriseService,
    private eventEmitter: EventemitterService) { }

  participantsProfile: any;
  jobName;

  ngOnInit(): void {
    let paramValue = this.activatedRoute.snapshot.paramMap.get("id");
    let paramValue2 = this.activatedRoute.snapshot.paramMap.get("recId");
    if (parseInt(paramValue) && parseInt(paramValue2)) {

      this.displayData(parseInt(paramValue), parseInt(paramValue2));
    }
  }

  displayData(id: number, recId: number) {
    this.entrepriseSer.getEntreprise(id).toPromise().then(data => {
this.jobName=data.entrepriseRects.find(x => x.id === recId).jobName;
      this.participantsProfile = this.profileSer.getProfilesByUsers(data.entrepriseRects.find(x => x.id === recId).participants);
    }).catch(err => {

      this.eventEmitter.showPopUP({ message: "an error occured displaying participants", type: "error" })
    })
  }

}
