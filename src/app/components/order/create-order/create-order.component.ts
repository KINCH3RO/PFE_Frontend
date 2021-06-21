import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryServiceService } from 'src/app/category-service.service';
import { Order } from 'src/app/models/order';
import { AuthService } from 'src/app/services/auth.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';

import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {

  cat: Observable<any[]>;
  subCat: Observable<any[]>;
  buttonText ="Place order";
  reactiveFormInitialvalue;
  currentOrder:Order;

  constructor(private fb: FormBuilder,
    private categoryService: CategoryServiceService,
    private orderService: OrderService,
    private eventEmitter: EventemitterService,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private router:Router) { }

  orderForm: FormGroup = this.fb.group({
    id: [0, [Validators.required]],
    title: ['', [Validators.required, Validators.minLength(15)]],
    description: ['', [Validators.required, Validators.minLength(15)]],
    category: ['', [Validators.required]],
    sub_category: ['', []],
    degital: ['', [Validators.required]],
    deliveryTime: [0, [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    deliveryTimeUnit: ['Hours', [Validators.required]],
    createdDate: [new Date(), []],
  })




  ngOnInit(): void {
    this.reactiveFormInitialvalue=this.orderForm.value;
    let paramValue = this.activatedRoute.snapshot.paramMap.get('id');
    if (paramValue) {

      if (parseInt(paramValue)) {
        this.orderService.findOrderByid(parseInt(paramValue)).toPromise().then(data => {

          this.currentOrder = data;
          this.orderForm.setValue({
            id: data.id,
            title: data.title,
            description: data.description,
            category: data.category,
            sub_category: data.sub_category ? data.sub_category : '',
            degital: data.degital,
            deliveryTime: data.deliveryTime,
            price: data.price,
            deliveryTimeUnit: data.deliveryTimeUnit,
            createdDate: data.createdDate,
          })

          this.displayCat();
          this.displaySubcats();
          this.buttonText="Save order";



        }).catch(err => {
          console.log(err);

        })

      }
    }


  }

  displayCat() {


    this.cat = this.isDegital.value == 'true' || this.isDegital.value == true ? this.categoryService.getAllCategories() : this.categoryService.getAllIRLCategories();
    this.subCat = this.isDegital.value == 'true' || this.isDegital.value == true ? this.subCat : null;
  }

  displaySubcats() {
    if (this.category.value && this.isDegital.value == 'true') {
      this.subCat = this.categoryService.getAllsubCatByCat(this.category.value)
    }
  }

  saveOrder() {


    if (this.orderForm.valid && this.auth.localUserId()) {



      let order = this.orderForm.value;
      order.user = { idUser: this.auth.localUserId() }
      //check if new or old offer
      if (this.id.value <= 0) {
        this.orderService.addOrder(this.orderForm.value).toPromise().then(data => {
          this.eventEmitter.showPopUP({ type: "success", message: "Your order has been created" })
          this.orderForm.reset(this.reactiveFormInitialvalue);
      
        

        }).catch(err => {
          this.eventEmitter.showPopUP({ type: "error", message: "An error occured creating your order" })
          console.log(err);

        });
      } else {
        this.orderForm.value.services = this.currentOrder.services;
       
        
        this.orderService.updateOrder(this.orderForm.value).toPromise().then(data => {
          this.eventEmitter.showPopUP({ type: "success", message: "Your order has been updated" })

          this.buttonText="Place order";
          this.orderForm.reset(this.reactiveFormInitialvalue);
          this.router.navigateByUrl("/myOrders")

        }).catch(err => {
          this.eventEmitter.showPopUP({ type: "error", message: "An error occured saving your order" })
          console.log(err);

        });
      }


    }
  }

  get id() {
    return this.orderForm.get("id");
  }

  get title() {
    return this.orderForm.get("title");
  }

  get description() {
    return this.orderForm.get("description");
  }


  get category() {
    return this.orderForm.get("category");
  }

  get sub_category() {
    return this.orderForm.get("sub_category");
  }

  get deliveryTime() {
    return this.orderForm.get("deliveryTime");
  }

  get deliveryTimeUnit() {
    return this.orderForm.get("deliveryTimeUnit");
  }
  get createdDate() {
    return this.orderForm.get("createdDate");
  }
  get isDegital() {
    return this.orderForm.get("degital");
  }

  get price() {
    return this.orderForm.get("price");
  }


}
