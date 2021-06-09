import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MarkerData } from 'src/app/models/marker-data';
import { Offer } from 'src/app/models/offer';
import { OfferService } from 'src/app/services/offer.service';
@Component({
  selector: 'app-services-map',
  templateUrl: './services-map.component.html',
  styleUrls: ['./services-map.component.css']
})
export class ServicesMapComponent implements OnInit {

  constructor(private offerService: OfferService) { }

  ngOnInit(): void {
    this.displayData();
  }

  features: MarkerData[] = []
  offers: Observable<Offer[]>;
  pageSize = 10;
  pageNumber = 0;
  title:string;
  showServiceDropDown = false;
  isDegital = false;
  selectedType = "IRL Service"
  showMap = false;

  displayData() {

   
    
    this.offers = this.offerService.getAllServicesByType(false, this.title);
    this.getData();

  }

  getData(){
   this.offers.toPromise().then(data => {

      data.forEach(offer => {
        this.features.push({

          header: (offer.user.name + ' ' + offer.user.familyName),
          description: offer.title,
          coordinates: [offer.lng, offer.lat],
          imageUrl: offer.serviceImageUrl[offer.mainPhotoIndex],
          headerLink: "/profile/" + offer.user.idUser,
          bottomLink: "/service/" + offer.id,
        })
      })
      this.showMap=true;
    })
  }


   filter() {
     this.features=[]
    this.showMap = false;
    this.displayData();

  }



  chooseServiceType(type) {

    this.isDegital = type;
    this.selectedType = this.isDegital ? "Degital Service" : "IRL Service"
    this.showServiceDropDown = false;
    this.displayData();

  }


}
