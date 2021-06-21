import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryServiceService } from 'src/app/category-service.service';
import { Category } from 'src/app/models/category';
import { Offer } from 'src/app/models/offer';
import { Plan } from 'src/app/models/plan';
import { CountryService } from 'src/app/services/country.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { OfferService } from 'src/app/services/offer.service';
import * as flickity from 'flickity';
import { MarkerData } from 'src/app/models/marker-data';
@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.css']
})
export class EditServiceComponent implements OnInit {

  constructor(
    private countrySer: CountryService,
    private categoryService: CategoryServiceService,
    private fileUpload: FileUploadService,
    private offerService: OfferService,
    private eventEmitter: EventemitterService,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  offerId: number = 24;
  isDegital: boolean = false;
  countries: Observable<any[]>;
  cat: Observable<any[]>;
  subCat: Observable<any[]>;

  packages: Plan[] = [];
  selectedPackageIndex = 0;
  editedPackageIndex = -1;
  packageButton = "Add";
  packagesLevelName = ["Basic", "Standard", "Premium", "Deleuxe"]

  imagesArray = [];
  videosArray = [];
  mainPhotoIndex = 0;
  loaded: boolean = false;

  currentService: Offer;
  features: MarkerData[] = []


  mapLocation: any;

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

  packageForm: FormGroup = this.fb.group({
    id: [0, []],
    title: ['', [Validators.required, Validators.minLength(6)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    price: ['', [Validators.required, Validators.min(1)]],
    deliveryTime: ['', [Validators.required, Validators.min(1)]],
    deliveryTimeUnit: ['Hours', [Validators.required]],
    packageLevel: ['', [Validators.required]],
  })



  ngOnInit(): void {
    this.offerId = parseInt(this.activatedRoute.snapshot.paramMap.get("id"));

    this.displayData();
    sessionStorage.removeItem('mapLocation')


  }

  setMapLocation() {
    this.mapLocation = JSON.parse(sessionStorage.getItem('mapLocation'))
    sessionStorage.removeItem('mapLocation')
  }

  async displayData() {

    this.countries = this.countrySer.getAllCountries();


    this.offerService.findOfferById(this.offerId).toPromise().then(data => {
      this.isDegital = data.degital;
      this.cat = this.isDegital ? this.categoryService.getAllCategories() : this.categoryService.getAllIRLCategories();
      this.currentService = data;

      this.features.push({
        header: '',
        description: '',
        coordinates: [data.lng, data.lat],
        imageUrl: '',
        headerLink: '',
        bottomLink: '',

      })

      this.serviceForm.setValue({
        title: data.title,
        description: data.description,
        category: '',
        sub_cat: ''
      })




      this.loaded = true;
      this.imagesArray = [...data.serviceImageUrl];
      this.videosArray = [...data.videoImageUrl];


      if (this.isDegital) {
        this.packages = data.plans;
        this.category.setValue(data.category.id);
        this.sub_cat.setValue(data.subcat.id);
        this.sort();
        this.displaySubcats();
        return;
      }


      this.category.setValue(data.category);


      this.IRLserviceForm.setValue({

        city: data.city,
        country: data.country,
        streetAdresse: data.adresse,
        price: data.price,
        deliveryTime: data.deliveryTime,
        deliveryTimeUnit: data.deliveryTimeUnit


      })



    }).catch(err => {

      this.eventEmitter.showPopUP({ type: "error", message: "Service id not found" })
      console.log("error" + err);


    })

    if (this.videosArray || this.imagesArray) {
      await new Promise(r => setTimeout(r, 500));

      this.initializeCarousel();
    }







  }

  displaySubcats() {
    if (this.category.value && this.isDegital) {
      this.subCat = this.categoryService.getAllsubCatByCat(this.category.value)
    }
  }




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

  get id() {
    return this.packageForm.get("id");
  }
  get titleP() {
    return this.packageForm.get("title");
  }
  get descriptionP() {
    return this.packageForm.get("description");
  }
  get priceP() {
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

      console.log(this.packages);
      console.log(this.level);
      if (this.packages.filter(x => x.packageLevel == this.level.value).length > 0) {
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
    this.selectedPackageIndex = 0;
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

  updateService() {

    this.offerService.findOfferById(this.offerId).toPromise().then(data => {

      let BasicInfo: Offer = data;
      if (this.serviceForm.valid) {
        BasicInfo.title = this.title.value;
        BasicInfo.description = this.description.value;
        BasicInfo.category = new Category(this.category.value)
        BasicInfo.subcat = new Category(this.sub_cat.value)
        BasicInfo.plans = this.packages;
        BasicInfo.serviceImageUrl = this.imagesArray;
        BasicInfo.videoImageUrl = this.videosArray;
        BasicInfo.mainPhotoIndex = this.mainPhotoIndex;

        if (!BasicInfo.degital) {


          this.setMapLocation();
          BasicInfo.subcat = null;
          BasicInfo.category = this.category.value;
          BasicInfo.country = this.country.value;
          BasicInfo.city = this.city.value;
          BasicInfo.adresse = this.streetAdresse.value;
          BasicInfo.price = this.price.value;
          if (this.mapLocation) {
            BasicInfo.lng = this.mapLocation.lng;
            BasicInfo.lat = this.mapLocation.lat;
          }


        }

        if (!BasicInfo.degital && !this.IRLserviceForm.valid) {
          this.eventEmitter.showPopUP({ type: "info", message: "please fill the uncompleted fields" })
          return;
        }

        this.offerService.updateService(BasicInfo, BasicInfo.degital).toPromise().then(data => {
          this.eventEmitter.showPopUP({ type: "success", message: "Your service has been updated" })

        }).catch(err => {
          this.eventEmitter.showPopUP({ type: "error", message: "an error occured saving your service" })
          console.log(err);


        })


      }

    })




  }


  setMainPhoto(id: number) {
    this.mainPhotoIndex = id;
  }

  async deleteAsset(id, type) {

    console.log(this.imagesArray);

    if (type == "video") {
      this.videosArray.splice(id, 1)
    } else {
      this.imagesArray.splice(id, 1)
    }


    this.loaded = false;
    await new Promise(r => setTimeout(r, 500));
    this.loaded = true;
    await new Promise(r => setTimeout(r, 500));
    this.initializeCarousel();
    console.log(this.imagesArray);


  }



  async onFileSelected(event) {

    this.loaded = false;
    let imageExtensions = ["png", "jpg", "jpeg"];

    let videoExtensions = ["mp4", "webm"];

    let selectedFile: File = event.target.files[0];

    await this.fileUpload.uploadFileOffers(selectedFile).then(data => {

      this.eventEmitter.showPopUP({ type: "info", message: "your image has been uploaded succesfully" })
      if (imageExtensions.includes(selectedFile.name.split('.').pop())) {

        this.imagesArray.push("/static/UploadedFiles/Images/" + data)

      } else if (videoExtensions.includes(selectedFile.name.split('.').pop())) {
        this.videosArray.push("/static/UploadedFiles/Videos/" + data)
      }





    }).catch(err => {
      console.log(err)
      this.eventEmitter.showPopUP({ type: "error", message: err.error })
    });








    await new Promise(r => setTimeout(r, 5000));


    this.loaded = true;
    await new Promise(r => setTimeout(r, 100));
    this.initializeCarousel();


  }

  async initializeCarousel() {

    let carousel = document.querySelector('.carousel');
    console.log(carousel);
    let flick = new flickity(carousel, {
      imagesLoaded: true,

    });
  }

  next() {

    this.updateService();


  }


}
