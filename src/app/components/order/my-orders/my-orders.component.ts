import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/models/order';
import { AuthService } from 'src/app/services/auth.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  constructor(private orderService: OrderService,
    private auth: AuthService,
    private eventEmitter: EventemitterService) { }

  orders: Observable<Order[]>
  pageSize = 4;
  pageNumber = 0;
  title;
  showModal = false;
  selectedOrder: number = -1;
  sortAsc=false;

  loadMore(){
    this.pageSize+=4;
    this.displayData();

  }
  closeModal() {
    this.showModal = false;
  }
  deleteOrder() {
    if (this.selectedOrder != -1) {
      this.orderService.deleteOrderBy(this.selectedOrder).toPromise().then(data => {
        this.eventEmitter.showPopUP({ message: "Order has been deleted succesfully", type: "success" })
        this.showModal = false
        this.displayData();
      }).catch(err => {
        this.eventEmitter.showPopUP({ message: "An error occured", type: "error" })
        console.log(err);
        this.showModal = false
      })
    }

  }


  ngOnInit(): void {
    this.displayData();
   

  }

  displayData() {
    let userId = parseInt(this.auth.localUserId());
    if (!userId) {
      return;
    }
    this.orders = this.orderService.getAllPaginOrdersByUser(this.pageSize, this.pageNumber, userId, this.title, this.sortAsc);


  }

}
