import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Plan } from 'src/app/models/plan';
import { CountryService } from 'src/app/services/country.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { OfferService } from 'src/app/services/offer.service';

@Component({
  selector: 'app-plans-info-page',
  templateUrl: './plans-info-page.component.html',
  styleUrls: ['./plans-info-page.component.css']
})
export class PlansInfoPageComponent implements OnInit {
  constructor(
    private offerSer: OfferService,
    private countrySer: CountryService,
    private eventEmitter: EventemitterService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  countries: Observable<any[]>;
  packages: Plan[] = [];
  
  selectedPackageIndex = 0;
  editedPackageIndex = -1;
  packageButton = "Add";
  packagesLevelName = ["Basic", "Standard", "Premium", "Deleuxe"]

  ngOnInit(): void {

    if (!this.offerSer.getBasicInfo()) {
      this.router.navigateByUrl("/serviceCreation/basic")
    }

    if (this.offerSer.getPlansInfo()) {
      this.packages = this.offerSer.getPlansInfo()

    }

    this.offerSer.pageNumber.next(2)
    this.countries = this.countrySer.getAllCountries();
  }

  packageForm: FormGroup = this.fb.group({
    id: [0, []],
    title: ['', [Validators.required, Validators.minLength(6)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    price: ['', [Validators.required, Validators.min(1)]],
    deliveryTime: ['', [Validators.required, Validators.min(1)]],
    deliveryTimeUnit: ['Hours', [Validators.required]],
    packageLevel: ['', [Validators.required]],
  })

  get id() {
    return this.packageForm.get("id");
  }
  get title() {
    return this.packageForm.get("title");
  }
  get description() {
    return this.packageForm.get("description");
  }
  get price() {
    return this.packageForm.get("price");
  }
  get deliveryTime() {
    return this.packageForm.get("deliveryTime");
  }
  get deliveryTimeUnit() {
    return this.packageForm.get("deliveryTimeUnit");
  }

  get level() {
    return this.packageForm.get("packageLevel");
  }



  addPackage() {
    if (this.packageForm.valid) {

      if (this.packages.filter(x => x.packageLevel === this.level.value).length > 0) {
        this.eventEmitter.showPopUP({ type: "info", message: "package of this level aleady exist" })
        return;
      }

      this.packages.push(this.packageForm.value)

      if (this.packages.length == 1) {
        this.selectedPackageIndex = 0;


      }

      this.sort();


      this.packageForm.reset();

    }
  }

  sort() {


    this.packages.sort((a, b) => {

      if (a.packageLevel > b.packageLevel) {
        return 1;
      }
      if (a.packageLevel < b.packageLevel) {
        return -1;
      }
      return 0;

    })


  }

  showPackage(id) {
    this.selectedPackageIndex = id;
  }

  deletePackage(id) {
    this.packages.splice(id, 1)
  }

  displayPackage(id) {
    this.packageForm.setValue({
      id: this.packages[id].id,
      title: this.packages[id].title,
      description: this.packages[id].description,
      price: this.packages[id].price,
      deliveryTime: this.packages[id].deliveryTime,
      deliveryTimeUnit: this.packages[id].deliveryTimeUnit,
      packageLevel: this.packages[id].packageLevel,
    })
    this.packageButton = "Save";
    this.editedPackageIndex = id;



  }

  editPackage() {
    this.packages[this.editedPackageIndex] = this.packageForm.value;
    this.packageButton = "Add";
    this.editedPackageIndex = -1;
    this.packageForm.reset();

  }



  next() {
    if(this.packages.length <=0){
      this.eventEmitter.showPopUP({message:"You should have at least one package" ,type:"info"})
      return;
    }

    if (!this.offerSer.getBasicInfo() || !this.offerSer.isDegital) {
      this.router.navigateByUrl("/serviceCreation/basic")
      this.eventEmitter.showPopUP({ type: "info", message: "an error occured please fill the form" })
      this.offerSer.clearSessionStorage();
      return;
    }

   

    this.offerSer.setPlansInfo(this.packages)

  

    this.router.navigateByUrl("serviceCreation/media")

  }



}
