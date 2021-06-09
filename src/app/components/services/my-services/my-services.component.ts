import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Offer } from 'src/app/models/offer';
import { AuthService } from 'src/app/services/auth.service';
import { OfferService } from 'src/app/services/offer.service';

@Component({
  selector: 'app-my-services',
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.css']
})
export class MyServicesComponent implements OnInit {

  constructor(private offerService:OfferService,private router:Router,private auth:AuthService) { }

  ngOnInit(): void {
    this.offers = this.offerService.findAllByUser(this.auth.localUserId());
  }

  showModal=false;

  
  offers:Observable<any>;
  chooseType(isDegital:boolean){
    this.offerService.isDegital=isDegital;
    this.offerService.clearSessionStorage();
    this.router.navigateByUrl("/serviceCreation/basic")

  }

}
