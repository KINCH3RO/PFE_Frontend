import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryServiceService } from 'src/app/category-service.service';
import { Category } from 'src/app/models/category';
import { Offer } from 'src/app/models/offer';
import { CountryService } from 'src/app/services/country.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { OfferService } from 'src/app/services/offer.service';
import * as mapboxgl from 'mapbox-gl'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-basic-info-page',
  templateUrl: './basic-info-page.component.html',
  styleUrls: ['./basic-info-page.component.css']
})
export class BasicInfoPageComponent implements OnInit {

  constructor(
    private countrySer: CountryService,
    private categoryService: CategoryServiceService,
    private offerService: OfferService,
    private eventEmitter: EventemitterService,
    private router: Router,
    private fb: FormBuilder
  ) { }



  mapLocation = null;
  isDegital: boolean = false;
  countries: Observable<any[]>;
  cat: Observable<any[]>;
  subCat: Observable<any[]>;
  showMap = false;


  ngOnInit(): void {


    this.offerService.pageNumber.next(1)
    this.displayData();
  }

  setMapLocation() {
    this.mapLocation = JSON.parse(sessionStorage.getItem('mapLocation'))

    if (!this.mapLocation) {
      this.eventEmitter.showPopUP({ type: "info", message: "please choose a location" })
      return;
    }
    sessionStorage.removeItem('mapLocation')
    this.showMap = false;

  }
  displayData() {
    this.isDegital = this.offerService.isDegital;
    this.countries = this.countrySer.getAllCountries();

    this.cat = this.isDegital ? this.categoryService.getAllCategories() : this.categoryService.getAllIRLCategories();
    if (this.offerService.getBasicInfo()) {
      let offer: Offer = this.offerService.getBasicInfo();
      this.serviceForm.setValue({
        title: offer.title,
        description: offer.description,
        category: '',
        sub_cat: ''
      })

      if (!this.isDegital) {
        this.IRLserviceForm.setValue({

          city: offer.city,
          country: offer.country,
          streetAdresse: offer.adresse,
          price: offer.price,
          deliveryTime: offer.deliveryTime,
          deliveryTimeUnit: offer.deliveryTimeUnit

        })
      }


    }



  }

  displaySubcats() {
    if (this.category.value && this.isDegital) {
      this.subCat = this.categoryService.getAllsubCatByCat(this.category.value)
    }
  }

  serviceForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(50)]],
    category: ['', [Validators.required]],
    sub_cat: ['', []],




  })

  IRLserviceForm: FormGroup = this.fb.group({
    city: ['', [Validators.required, Validators.minLength(3)]],
    country: ['', [Validators.required]],
    streetAdresse: ['', [Validators.required, Validators.minLength(5)]],
    price: [0, [Validators.min(0)]],
    deliveryTime: ['', [Validators.required, Validators.min(1)]],
    deliveryTimeUnit: ['Hours', [Validators.required]]
  })


  get title() {
    return this.serviceForm.get("title");
  }
  get description() {
    return this.serviceForm.get("description");
  }
  get category() {
    return this.serviceForm.get("category");
  }
  get sub_cat() {
    return this.serviceForm.get("sub_cat");
  }

  get city() {
    return this.IRLserviceForm.get("city");
  }
  get country() {
    return this.IRLserviceForm.get("country");
  }
  get streetAdresse() {
    return this.IRLserviceForm.get("streetAdresse");
  }
  get price() {
    return this.IRLserviceForm.get("price");
  }

  get deliveryTimeIRL() {
    return this.IRLserviceForm.get("deliveryTime");
  }
  get deliveryTimeUnitIRL() {
    return this.IRLserviceForm.get("deliveryTimeUnit");
  }


  composeObject() {
    let BasicInfo: Offer = new Offer();
    if (this.serviceForm.valid) {
      BasicInfo.title = this.title.value;
      BasicInfo.description = this.description.value;
      BasicInfo.category = new Category(this.category.value)
      BasicInfo.subcat = new Category(this.sub_cat.value)


      if (!this.isDegital) {


        BasicInfo.category = this.category.value;
        BasicInfo.country = this.country.value;
        BasicInfo.city = this.city.value;
        BasicInfo.adresse = this.streetAdresse.value;
        BasicInfo.price = this.price.value;


        BasicInfo.deliveryTime = this.deliveryTimeIRL.value;
        BasicInfo.deliveryTimeUnit = this.deliveryTimeUnitIRL.value;
        if (this.mapLocation) {
          BasicInfo.lng = this.mapLocation.lng;
          BasicInfo.lat = this.mapLocation.lat;
        }

      }
    }

    return BasicInfo;
  }

  next() {

    if (!this.serviceForm.valid) {
      return;
    }

    if (!this.isDegital && !this.IRLserviceForm.valid) {

      return;
    }



    this.offerService.setBasicInfo(this.composeObject())

    if (this.isDegital) {
      this.router.navigateByUrl("serviceCreation/plans")
      return;
    }

    this.router.navigateByUrl("serviceCreation/media")



  }


}
