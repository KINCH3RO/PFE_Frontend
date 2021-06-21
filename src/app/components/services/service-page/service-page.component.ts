import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as flickity from 'flickity';
import { title } from 'process';
import { MarkerData } from 'src/app/models/marker-data';
import { Offer } from 'src/app/models/offer';
import { Plan } from 'src/app/models/plan';
import { Profile } from 'src/app/models/profile';
import { OfferService } from 'src/app/services/offer.service';
import { ProfileService } from 'src/app/services/profile.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-service-page',
  templateUrl: './service-page.component.html',
  styleUrls: ['./service-page.component.css']
})
export class ServicePageComponent implements OnInit, AfterViewInit {

  constructor(private offerSer: OfferService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private profileSer: ProfileService) {

  }

  features: MarkerData[] = []

  imagesArray = [];
  videosArray = [];
  packages: Plan[] = [];
  profile: Profile;
  selectedPackageIndex = 0;
  packagesLevelName = ["Basic", "Standard", "Premium", "Deleuxe"]
  loaded = true;
  env: Object;

  currentService: Offer;
  ngOnInit(): void {
    this.env = environment;
    let id: number = parseInt(this.activatedRoute.snapshot.paramMap.get("id"));
    if (!id) {
      return;
    }

    this.offerSer.findOfferById(id).toPromise().then(data => {
      this.currentService = data;
      this.imagesArray = this.currentService.serviceImageUrl;
      this.videosArray = this.currentService.videoImageUrl;
      this.packages = data.plans;
      this.sort();
      this.features.push({
        header: (this.currentService.user.name + ' ' + this.currentService.user.familyName),
        description: this.currentService.title,
        coordinates: [this.currentService.lng, this.currentService.lat],
        imageUrl: this.currentService.serviceImageUrl[this.currentService.mainPhotoIndex],
        headerLink: "/profile/" + this.currentService.user.idUser,
        bottomLink: "/service/" + this.currentService.id,

      })

      this.profileSer.getProfileByUser(data.user).toPromise().then(data => {
        this.profile = data;
      }).catch(err => {

      })

    }).catch(err => {

    })

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

  ngAfterViewInit(): void {
    this.initializeCarousel();
    if (this.currentService) {

    }

  }
  async initializeCarousel() {

    await new Promise(r => setTimeout(r, 500));
    let carousel = document.querySelector('.carousel');
    console.log(carousel);
    let flick = new flickity(carousel, {
      imagesLoaded: true,

    });
  }

}
