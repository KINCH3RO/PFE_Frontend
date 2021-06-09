import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OfferService } from 'src/app/services/offer.service';

@Component({
  selector: 'app-steps-page',
  templateUrl: './steps-page.component.html',
  styleUrls: ['./steps-page.component.css']
})
export class StepsPageComponent implements OnInit {

  constructor(private offerser:OfferService,private cd:ChangeDetectorRef) { }
  active=false;
  pageNumber=0;
  isDegital=false;
  ngOnInit(): void {
    this.isDegital=this.offerser.isDegital;
    this.offerser.pageNumber.subscribe(data=>{
      this.pageNumber=data;
      this.cd.detectChanges();
    })


  }

}
