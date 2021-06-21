import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Offer } from 'src/app/models/offer';
import { Order } from 'src/app/models/order';
import { AuthService } from 'src/app/services/auth.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { OfferService } from 'src/app/services/offer.service';
import { OrderService } from 'src/app/services/order.service';
@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.css']
})
export class OrdersPageComponent implements OnInit {

  constructor(private orderService: OrderService,
    private auth: AuthService,
    private eventEmitter: EventemitterService,
    private offerService: OfferService) { }

  orders: Observable<Order[]>
  pageSize = 4;
  pageNumber = 0;
  selectedOrderId = 0;
  title;
  showModal = false;
  selectedOrder: number = -1;
  offers: Observable<any>;
  isDegital = true;


  loadMore() {
    this.pageSize += 4;
    this.displayData();

  }

  showServicesModal(type: boolean, id: number) {
    
    this.offers = this.offerService.findAllByUserAndType(this.auth.localUserId(), type);
    this.selectedOrderId = id;
    this.showModal = true;
  }

  sumbitOffer(offerId) {

   

    if (this.selectedOrderId <= 0) {
      return;
    }

    this.orderService.sumbitServiceToOrder({
      orderId: this.selectedOrderId,
      serviceId: offerId
    }).toPromise().then(data => {
      this.eventEmitter.showPopUP({ message: data, type: "success" })
      this.showModal = false;
      this.selectedOrderId = 0;


    }).catch(err => {
      this.eventEmitter.showPopUP({ message: err.error, type: "info" })
      console.log(err);
      


    })

  }








  ngOnInit(): void {
    this.displayData();
  }

  displayData() {

    this.orders = this.orderService.getAllPaginOrders(this.pageSize, this.pageNumber, this.title, this.isDegital);


  }
}
