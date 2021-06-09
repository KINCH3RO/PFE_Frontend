import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Offer } from 'src/app/models/offer';
import { OfferService } from 'src/app/services/offer.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  constructor(private offerService:OfferService) { }

  ngOnInit(): void {
    this.displayData();
  }

  offers:Observable<Offer[]>;
  pageSize=10;
  pageNumber=0;
  title;
  showServiceDropDown =false;
  isDegital=false;


  selectedType="IRL Service"

  displayData(){
    this.offers=this.offerService.getAllPaginServices(this.pageSize,this.pageNumber,this.title,this.isDegital)
   
  }

  filter(){
    this.offers=this.offerService.getAllPaginServices(this.pageSize,this.pageNumber,this.title,this.isDegital)
  }
  
  chooseServiceType(type){

    this.isDegital =type;
    this.selectedType = this.isDegital? "Degital Service" : "IRL Service"
    this.showServiceDropDown=false ;
    this.displayData();
    
  }

}
