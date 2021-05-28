import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CountryService } from 'src/app/services/country.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-basic-info',
  templateUrl: './profile-basic-info.component.html',
  styleUrls: ['./profile-basic-info.component.css']
})
export class ProfileBasicInfoComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private countrySer: CountryService,
    private profileSer: ProfileService,
    private userSer: UserService,
    private authServ: AuthService,
    private eventEmitter: EventemitterService,
    private router: Router) { }

    ngOnInit(): void {
      this.countries = this.countrySer.getAllCountries();
      this.displayData();
    }
    
  languages: any = []
  language: string = "";
  languagelevel: string;
  index: number;
  addOrSave = "Add";
  countries: Observable<any[]>;
  profileExist = false;
  

  profileForm: FormGroup = this.fb.group({
    city: ['', [Validators.required, Validators.minLength(3)]],
    country: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(40)]],
    streetAddress: ['', []],
    protfolioWebSiteUrl: ['', [Validators.pattern(/^(https?\:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})(\/[\w]*)*$/)]],
    speciality: ['', [Validators.required, Validators.minLength(3)]],
    primaryL: ['', [Validators.required, Validators.minLength(3)]],
    profileDate: [new Date(), []],

   
  })



  displayData() {
    this.userSer.getUserById(this.authServ.localUserId()).toPromise().then(data => {



      this.profileSer.getProfileByUser(data).toPromise().then(profile => {

        this.profileExist = true;
        this.profileForm.setValue({
          city: profile.city,
          country: profile.country,
          description: profile.description,
          streetAddress: profile.streetAddress,
          protfolioWebSiteUrl: profile.protfolioWebSiteUrl,
          profileDate: profile.profileDate,
          primaryL:profile.primaryLanguage,
          speciality:profile.speciality

        })
        this.languages = profile.languages;



      }).catch(err => {
        this.profileExist = false;

        this.eventEmitter.showPopUP({ type: 'info', message: "Please fill the forms" })
      })

    }).catch(err => {
      this.eventEmitter.showPopUP({ type: 'error', message: "user cannot be found" })
    })
  }

  addLanguage() {

    console.log(this.language)
    this.languages.push({

      language: this.language,
      languagelevel: this.languagelevel
    })

    this.language = "";
    this.languagelevel = "";

  }

  deleteLanguage(i) {
    this.languages.splice(i, 1);
  }

  displayTableData(i) {
    this.language = this.languages[i].language;
    this.languagelevel = this.languages[i].languagelevel;
    this.index = i;
    this.addOrSave = "Save";
  }

  updateLanguage() {
    this.languages[this.index].language = this.language;
    this.languages[this.index].languagelevel = this.languagelevel;
    this.addOrSave = "Add";
    this.index = -1;
    this.language = "";
    this.languagelevel = "Beginner";
  }

  addProfile() {
    if (this.profileForm.valid) {

      if (this.profileExist) {
        this.userSer.getUserById(this.authServ.localUserId()).toPromise().then(data => {


          this.profileSer.getProfileByUser(data).toPromise().then(profile => {

            profile.city = this.city.value;
            profile.country = this.country.value;
            profile.description = this.description.value;
            profile.streetAddress = this.streetAddress.value;
            profile.protfolioWebSiteUrl = this.protfolioWebSiteUrl.value;
            profile.languages = this.languages;
            profile.speciality = this.speciality.value;
            profile.primaryLanguage = this.primaryL.value;

            console.log(this.languages)
            console.log(profile)


            this.profileSer.updateProfile(profile).toPromise().then(data => {
              this.eventEmitter.showPopUP({ type: 'success', message: "profile has been updated" })
              this.router.navigateByUrl("/profileCreation/pro")
            }).catch(err => {
              this.eventEmitter.showPopUP({ type: 'error', message: err.error })
            })


          }).catch(err => {

            this.eventEmitter.showPopUP({ type: 'error', message: err.error })
          })

        }).catch(err => {
          this.eventEmitter.showPopUP({ type: 'error', message: "user cannot be found" })
        })
      } else {
        this.userSer.getUserById(this.authServ.localUserId()).toPromise().then(data => {

          let formValues = this.profileForm.value;
          formValues.languages = this.languages;
          formValues.user = data

          this.profileSer.addProfile(formValues).toPromise().then(data => {

            this.eventEmitter.showPopUP({ type: 'info', message: "Basic profile info has been saved" })
            this.router.navigateByUrl("/profileCreation/pro")
          }).catch(err => {
            this.eventEmitter.showPopUP({ type: 'error', message: err.error })
          })



        }).catch(err => {
          this.eventEmitter.showPopUP({ type: 'error', message: "user cannot be found" })
        })

      }


    }

  }
  get city() {
    return this.profileForm.get("city");
  }
  get country() {
    return this.profileForm.get("country");
  }
  get description() {
    return this.profileForm.get("description");
  }
  get streetAddress() {
    return this.profileForm.get("streetAddress");
  }
  get protfolioWebSiteUrl() {
    return this.profileForm.get("protfolioWebSiteUrl");
  }

  get speciality() {
    return this.profileForm.get("speciality");
  }

  get primaryL() {
    return this.profileForm.get("primaryL");
  }

}
