import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryServiceService } from 'src/app/category-service.service';
import { Entreprise } from 'src/app/models/entreprise';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CountryService } from 'src/app/services/country.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { Location } from '@angular/common';

import { OrderService } from 'src/app/services/order.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-entreprise',
  templateUrl: './create-entreprise.component.html',
  styleUrls: ['./create-entreprise.component.css']
})

export class CreateEntrepriseComponent implements OnInit {


  countries: Observable<any>
  cities: Observable<any>
  pagePic;
  Adding = true;
  ButtonText="Create Entreprise";
  coverImageValue;
  selectedCoverFile: File;
  currentEntreprise :Entreprise;
  entrepriseFormIntitalvalue;
  constructor(private fb: FormBuilder,
    private countrySer: CountryService,
    private fileUpload: FileUploadService,
    private eventEmitter: EventemitterService,
    private auth: AuthService,
    private entrepriseService: EntrepriseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _location: Location) { }

  ngOnInit(): void {

    
    this.entrepriseFormIntitalvalue = this.entrepriseForm.value;
    let paramValue = this.activatedRoute.snapshot.paramMap.get("id");
    if (parseInt(paramValue)) {
      this.entrepriseService.getEntreprise(parseInt(paramValue)).toPromise().then(data => {
        this.currentEntreprise=data;
        this.entrepriseForm.setValue({
          id: data.id,
          name: data.name,
          city: data.city,
          country:data.country,
          adresse:data.adresse,
          description: data.description,
          website: data.website,
          initiatedDate: data.initiatedDate,
          coverPhotoUrl: data.coverPhotoUrl,
          pagePhotoUrl: data.pagePhotoUrl,
          specialization:data.specialization,
          owner:data.owner,
          createdDate:data.createdDate

        })
        
        this.Adding=false;
        this.ButtonText="Update Entreprise";

        this.pagePic=data.pagePhotoUrl;
        this.coverImageValue=environment.endPoint+data.coverPhotoUrl;
        this.displayCities();

      }).catch(err => {

        this._location.back();
        this.eventEmitter.showPopUP({message:"Sorry ! an error occured please try again",type:"error"})


      })

    }

    this.displayData();
    
   
  
  }

  displayData() {
    this.countries = this.countrySer.getAllCountries();
  }
  displayCities() {
    this.cities = this.countrySer.getAllCities(this.country.value)
  }
  entrepriseForm: FormGroup = this.fb.group({
    id: [0, [Validators.required]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    city: ['', [Validators.required, Validators.minLength(3)]],
    country: ['', [Validators.required, Validators.minLength(3)]],
    adresse: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(50)]],
    website: ['', [Validators.pattern(/^(https?\:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})(\/[\w]*)*$/)]],
    initiatedDate: [new Date(), [Validators.required]],
    coverPhotoUrl: ['', []],
    pagePhotoUrl: ['', []],
    specialization: ['', [Validators.required, Validators.minLength(3)]],
    owner: [new User(this.auth.localUser()), []],
    createdDate: [new Date(), []],


  })

  saveEntreprise(){
    if(this.id.value>0){
      this.updateEntreprise();
         
    }else{
      this.addEntreprise();
    }
  }

  async addEntreprise() {

    if (this.entrepriseForm.valid) {
      let entreprise: Entreprise = this.entrepriseForm.value;
      entreprise.pagePhotoUrl = this.pagePic;
      if (this.selectedCoverFile) {


        await this.fileUpload.uploadFileEntreprise(this.selectedCoverFile).then(data => {

          entreprise.coverPhotoUrl = "/static/UploadedFiles/Images/" + data;

        }).catch(err => {
          console.log(err)
          this.eventEmitter.showPopUP({ type: "error", message: err.error })
        });

      }

    
      
      
      this.entrepriseService.addEntreprise(entreprise).toPromise().then(data => {
        console.log(this.entrepriseForm.value);
        this.coverImageValue = null;
        this.pagePic = null;
        this.eventEmitter.showPopUP({ type: "success", message: "Entreprise has been created succesfully" })
        this.entrepriseForm.reset(this.entrepriseFormIntitalvalue);
      }).catch(err => {
        this.eventEmitter.showPopUP({ type: "success", message: "an error with the server occured" })
        console.log(err);

      })

    }


  }

  async updateEntreprise() {


    if (this.entrepriseForm.valid) {
      let entreprise: Entreprise = this.entrepriseForm.value;

      entreprise.pagePhotoUrl = this.pagePic;
      entreprise.entrepriseRects = this.currentEntreprise.entrepriseRects;
      entreprise.entreprisePosts=this.currentEntreprise.entreprisePosts;
      if (this.selectedCoverFile) {

      

        await this.fileUpload.uploadFileEntreprise(this.selectedCoverFile).then(data => {

          entreprise.coverPhotoUrl = "/static/UploadedFiles/Images/" + data;

        }).catch(err => {
          console.log(err)
          this.eventEmitter.showPopUP({ type: "error", message: err.error })
        });

      }

      this.entrepriseService.updateEntreprise(entreprise).toPromise().then(data => {


        this.eventEmitter.showPopUP({ type: "success", message: "Entreprise has been saved succesfully" })
        this.entrepriseForm.reset(this.entrepriseFormIntitalvalue);
      }).catch(err => {
        this.eventEmitter.showPopUP({ type: "success", message: "an error with the server occured" })
        console.log(err);

      })

    }


  }

  openFile(id) {

    let element: HTMLElement = document.getElementById(id) as HTMLElement;
    element.click();

  }


  async onFileSelected(event) {

    //update user photo
    let tempData;
    this.pagePic = "";
    var selectedFile: File = event.target.files[0];
    await this.fileUpload.uploadFileEntreprise(selectedFile).then(data => {

      this.eventEmitter.showPopUP({ type: "info", message: "your image has been uploaded succesfully" })
      console.log(data);
      tempData = "/static/UploadedFiles/Images/" + data;



    }).catch(err => {
      console.log(err)
      this.eventEmitter.showPopUP({ type: "error", message: err.error })
    });


    await new Promise(r => setTimeout(r, 5000))
    //update the DOM
    this.pagePic = tempData;


  }


  readURL(event): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedCoverFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.coverImageValue = reader.result;

      reader.readAsDataURL(this.selectedCoverFile);
    }
  }

  get id() {
    return this.entrepriseForm.get("id");
  }

  get name() {
    return this.entrepriseForm.get("name");
  }

  get city() {
    return this.entrepriseForm.get("city");
  }

  get country() {
    return this.entrepriseForm.get("country");
  }


  get adresse() {
    return this.entrepriseForm.get("adresse");
  }

  get description() {
    return this.entrepriseForm.get("description");
  }

  get website() {
    return this.entrepriseForm.get("website");
  }

  get initiatedDate() {
    return this.entrepriseForm.get("initiatedDate");
  }
  get coverPhotoUrl() {
    return this.entrepriseForm.get("coverPhotoUrl");
  }
  get specialization() {
    return this.entrepriseForm.get("specialization");
  }

  get createdDate() {
    return this.entrepriseForm.get("createdDate");
  }


}
