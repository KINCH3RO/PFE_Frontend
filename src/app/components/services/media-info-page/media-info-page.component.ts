import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { from } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { OfferService } from 'src/app/services/offer.service';
import { environment } from 'src/environments/environment';
import * as flickity from 'flickity';
import { Offer } from 'src/app/models/offer';
import { Plan } from 'src/app/models/plan';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-media-info-page',
  templateUrl: './media-info-page.component.html',
  styleUrls: ['./media-info-page.component.css']
})
export class MediaInfoPageComponent implements OnInit {


  constructor(private offerSer: OfferService,
    private fileUpload: FileUploadService,
    private router: Router,
    private eventEmitter: EventemitterService,
    private auth: AuthService,
    
  ) { }

  imagesArray = [];
  videosArray = [];
  mainPhotoIndex = 0;
  loaded: boolean = false;
 


  ngOnInit(): void {
     

    this.displayData();
    this.offerSer.pageNumber.next(3)

    let basic = this.offerSer.getBasicInfo();

    if (!basic) {
      this.router.navigateByUrl("/serviceCreation/basic ")
      this.eventEmitter.showPopUP({ type: "info", message: "an error occured please fill the form" })
    }
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

    this.setAssetsInSession()
    this.loaded = false;
    await new Promise(r => setTimeout(r, 500));
    this.loaded = true;
    await new Promise(r => setTimeout(r, 500));
    this.initializeCarousel();
    console.log(this.imagesArray);


  }
  async displayData() {

    if (!this.offerSer.getAssestsInfo()) {
      return;
    }
    this.imagesArray = [...this.offerSer.getAssestsInfo().images];
    this.videosArray = [...this.offerSer.getAssestsInfo().videos];
    this.loaded = true;
    await new Promise(r => setTimeout(r, 500));

    this.initializeCarousel();
  }

  setAssetsInSession() {
    this.offerSer.setAssetsInfo({
      images: this.imagesArray,
      videos: this.videosArray
    });
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




  

    this.setAssetsInSession();


    await new Promise(r => setTimeout(r, 5000));


    this.loaded = true;
    await new Promise(r => setTimeout(r, 500));
    this.initializeCarousel();


  }

   initializeCarousel() {

    let carousel = document.querySelector('.carousel');
    console.log(carousel);
    let flick = new flickity(carousel, {
      imagesLoaded: true,

    });
  }

  addDegitalService() {
    let plans: Plan[] = this.offerSer.getPlansInfo();
    let basic: Offer = this.offerSer.getBasicInfo();
    let user: User = new User();
    user.idUser = this.auth.localUserId();

    if (!plans || !basic) {
      this.router.navigateByUrl("/serviceCreation/basic ")
      this.eventEmitter.showPopUP({ type: "info", message: "an error occured please fill the form" })
      return;
    }

    basic.plans = plans;
    basic.user = user;
    basic.mainPhotoIndex=this.mainPhotoIndex;
    basic.serviceImageUrl = this.imagesArray;
    basic.videoImageUrl = this.videosArray;
    this.offerSer.addService(basic).toPromise().then(data => {
      this.eventEmitter.showPopUP({ type: "info", message: "Your service  creation has been completed" })
    }).catch(err => {

      this.eventEmitter.showPopUP({ type: "error", message: "an error occured please fill the form" })

    })
  }

  addIRLService() {
    let basic: Offer = this.offerSer.getBasicInfo();
    let user: User = new User();
    user.idUser = this.auth.localUserId();
    if (!basic) {
     
      this.router.navigateByUrl("/serviceCreation/basic ")
      this.eventEmitter.showPopUP({ type: "info", message: "an error occured please fill the form" })
      return;
    }
    basic.available = true;
    basic.mainPhotoIndex=this.mainPhotoIndex;
    basic.user =user;
    basic.serviceImageUrl = this.imagesArray;
    basic.videoImageUrl = this.videosArray;

    this.offerSer.addIRLService(basic).toPromise().then(data => {
      this.eventEmitter.showPopUP({ type: "info", message: "Your service creation has been completed" })
    }).catch(err => {

      this.eventEmitter.showPopUP({ type: "error", message: "an error occured please fill the form" })
    })
  }

  next() {



    try {
      if (this.offerSer.isDegital) {
        this.addDegitalService()

      } else {

        this.addIRLService()
      }
    } catch (error) {
      return;
    }


    this.router.navigateByUrl("serviceCreation/finish")

  }



}
