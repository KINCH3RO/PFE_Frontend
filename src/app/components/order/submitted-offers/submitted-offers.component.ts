import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from 'src/app/models/order';
import { AuthService } from 'src/app/services/auth.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { OrderService } from 'src/app/services/order.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-submitted-offers',
  templateUrl: './submitted-offers.component.html',
  styleUrls: ['./submitted-offers.component.css']
})
export class SubmittedOffersComponent implements OnInit {

  constructor(private orderService: OrderService,
    private auth: AuthService,
    private eventEmitter: EventemitterService,
    private activatedRoute: ActivatedRoute) { }

  order: Observable<Order>
  env:Object
  ngOnInit(): void {
    this.env=environment;
    let id = this.activatedRoute.snapshot.paramMap.get("id");
    if (parseInt(id)) {
      this.order = this.orderService.findOrderByid(parseInt(id));
    }
  }

}
