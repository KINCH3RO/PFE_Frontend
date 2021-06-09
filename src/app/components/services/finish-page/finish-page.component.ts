import { Component, OnInit } from '@angular/core';
import { OfferService } from 'src/app/services/offer.service';

@Component({
  selector: 'app-finish-page',
  templateUrl: './finish-page.component.html',
  styleUrls: ['./finish-page.component.css']
})
export class FinishPageComponent implements OnInit {

  constructor(private offerSer:OfferService) { }

  ngOnInit(): void {
    this.offerSer.pageNumber.next(4);
    this.offerSer.clearSessionStorage();
  }

}
