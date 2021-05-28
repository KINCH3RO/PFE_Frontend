import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CountryService } from 'src/app/services/country.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private countrySer: CountryService,
    private eventEmitter: EventemitterService,
    private userSer: UserService,
    private profileSer: ProfileService,
    private authSer: AuthService) { }

  ngOnInit(): void {
    this.countries = this.countrySer.getAllCountries();
    this.displayData();
  }

  educationFrom: FormGroup = this.fb.group({
    id: [0, []],
    country: ['', [Validators.required]],
    startYear: ['', [Validators.required, Validators.pattern(/^((20){1}|(19){1})[0-9]{2}$/)]],
    endYear: ['', [Validators.required, Validators.pattern(/^((20){1}|(19){1})[0-9]{2}$/)]],
    schoolName: ['', [Validators.required]],
    specialization: ['', [Validators.required]]
  })
  certificationForm: FormGroup = this.fb.group({
    id: [0, []],
    name: ['', [Validators.required]],
    specialization: ['', [Validators.required]],
    certifiedFrom: ['', [Validators.required]],
    certificationDate: ['', [Validators.required]],

  })

  occupationForm: FormGroup = this.fb.group({
    id: [0, []],
    country: ['', [Validators.required]],
    startYear: ['', [Validators.required, Validators.pattern(/^((20){1}|(19){1})[0-9]{2}$/)]],
    endYear: ['', [Validators.required, Validators.pattern(/^((20){1}|(19){1})[0-9]{2}$/)]],
    title: ['', [Validators.required]],
    specialization: ['', [Validators.required]]

  })


  profileForm: FormGroup = this.fb.group({
    city: ['', [Validators.required, Validators.minLength(3)]],
    country: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(40)]],
    streetAddress: ['', []],
    protfolioWebSiteUrl: ['', [Validators.pattern(/^(https?\:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})(\/[\w]*)*$/)]],
    profileDate: [new Date(), []],
    speciality: ['', [Validators.required, Validators.minLength(3)]],
    primaryL: ['', [Validators.required, Validators.minLength(3)]]
  })


  countries: Observable<any[]>;
  educations: any = [];
  certifications: any = []
  occupations: any = []
  educationIndex: number;
  certificationIndex: number;
  occupationIndex: number;
  educationButton = "Add";
  occupationButton = "Add";
  certificationButton = "Add";

  languages: any = []
  language: string = "";
  languagelevel: string;
  index: number;
  addOrSave = "Add";

  displayData() {
    this.userSer.getUserById(this.authSer.localUserId()).toPromise().then(data => {


      this.profileSer.getProfileByUser(data).toPromise().then(profile => {


        this.occupations = profile.occupations;
        this.certifications = profile.certifications;
        this.educations = profile.educations;

        this.profileForm.setValue({
          city: profile.city,
          country: profile.country,
          description: profile.description,
          streetAddress: profile.streetAddress,
          protfolioWebSiteUrl: profile.protfolioWebSiteUrl,
          profileDate: profile.profileDate,
          primaryL: profile.primaryLanguage,
          speciality: profile.speciality
        })
        this.languages = profile.languages;
        ;

      }).catch(err => {

        this.eventEmitter.showPopUP({ type: 'error', message: err.error })
      })

    }).catch(err => {
      this.eventEmitter.showPopUP({ type: 'error', message: "user cannot be found" })
    })
  }
  updateProfile() {
    this.userSer.getUserById(this.authSer.localUserId()).toPromise().then(data => {


      this.profileSer.getProfileByUser(data).toPromise().then(profile => {

        profile.city = this.city.value;
        profile.country = this.country.value;
        profile.description = this.description.value;
        profile.streetAddress = this.streetAddress.value;
        profile.protfolioWebSiteUrl = this.protfolioWebSiteUrl.value;
        profile.speciality = this.speciality.value;
        profile.primaryLanguage = this.primaryL.value;
        profile.languages = this.languages;
        profile.occupations = this.occupations;
        profile.certifications = this.certifications;
        profile.educations = this.educations;


        this.profileSer.updateProfile(profile).toPromise().then(data => {
          this.eventEmitter.showPopUP({ type: 'success', message: "profile has been updated" })
        }).catch(err => {
          this.eventEmitter.showPopUP({ type: 'error', message: err.error })
        })


      }).catch(err => {

        this.eventEmitter.showPopUP({ type: 'error', message: err.error })
      })

    }).catch(err => {
      this.eventEmitter.showPopUP({ type: 'error', message: "user cannot be found" })
    })

  }





  // education block 
  addEducations() {

    if (this.EstartYear.value > this.EendYear.value) {
      return;
    }
    if (this.educationFrom.invalid) {
      return;
    }


    this.educations.push(this.educationFrom.value)
    console.log(this.educationFrom.value);

    this.educationFrom.reset()
  }

  deleteEducations(i) {
    this.educations.splice(i, 1);
  }

  displayEducations(i) {
    this.educationFrom.get('id').setValue(this.educations[i].id)
    this.Ecountry.setValue(this.educations[i].country)
    this.EstartYear.setValue(this.educations[i].startYear)
    this.EendYear.setValue(this.educations[i].endYear)
    this.EschoolName.setValue(this.educations[i].schoolName)
    this.Especialization.setValue(this.educations[i].specialization)
    this.educationButton = "Save";
    this.educationIndex = i;

  }

  updateEducations() {
    if (this.educationFrom.invalid) {
      return;
    }
    this.educations[this.educationIndex] = this.educationFrom.value;
    this.educationIndex = -1;
    this.educationButton = "Add";
    this.educationFrom.reset();
  }

  //Certification block

  addCertification() {


    if (this.certificationForm.invalid) {
      return;
    }


    this.certifications.push(this.certificationForm.value)


    this.certificationForm.reset()
  }

  deleteCertification(i) {
    this.certifications.splice(i, 1);
  }

  displayCertification(i) {
    this.certificationForm.get('id').setValue(this.certifications[i].id);
    this.CcertificationDate.setValue(this.certifications[i].certificationDate)
    this.Cname.setValue(this.certifications[i].name)
    this.Cspecialization.setValue(this.certifications[i].specialization)
    this.CcertifiedFrom.setValue(this.certifications[i].certifiedFrom)
    this.certificationIndex = i;
    this.certificationButton = "Save";

  }

  updateCertification() {
    if (this.certificationForm.invalid) {
      return;
    }
    this.certifications[this.certificationIndex] = this.certificationForm.value;
    this.certificationIndex = -1;
    this.certificationButton = "Add";
    this.certificationForm.reset();
  }

  //OccupationBlock

  addOccupation() {

    if (this.OstartYear.value > this.OendYear.value) {
      this.eventEmitter.showPopUP({ type: "info", message: "Start year cant be greater then end year" })
      return
    }
    if (this.occupationForm.invalid) {
      return;
    }


    this.occupations.push(this.occupationForm.value)


    this.occupationForm.reset()
  }

  deleteOccupation(i) {
    this.occupations.splice(i, 1);
  }

  displayOccupation(i) {
    this.occupationForm.get('id').setValue(this.occupations[i].id)
    this.Ocountry.setValue(this.occupations[i].country)
    this.OstartYear.setValue(this.occupations[i].startYear)
    this.OendYear.setValue(this.occupations[i].endYear)
    this.Otitle.setValue(this.occupations[i].title)
    this.Ospecialization.setValue(this.occupations[i].specialization)
    this.occupationButton = "Save";
    this.occupationIndex = i;

  }

  updateOccupation() {
    if (this.occupationForm.invalid) {
      return;
    }
    this.occupations[this.occupationIndex] = this.occupationForm.value;
    this.occupationIndex = -1;
    this.occupationButton = "Add";
    this.occupationForm.reset();
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



  get Ecountry() {
    return this.educationFrom.get("country")
  }
  get EstartYear() {
    return this.educationFrom.get("startYear")
  }

  get EendYear() {
    return this.educationFrom.get("endYear")
  }
  get EschoolName() {
    return this.educationFrom.get("schoolName")
  }
  get Especialization() {
    return this.educationFrom.get("specialization")
  }

  get Cname() {
    return this.certificationForm.get("name")
  }
  get Cspecialization() {
    return this.certificationForm.get("specialization")
  }

  get CcertifiedFrom() {
    return this.certificationForm.get("certifiedFrom")
  }
  get CcertificationDate() {
    return this.certificationForm.get("certificationDate")
  }


  get Ocountry() {
    return this.occupationForm.get("country")
  }
  get OstartYear() {
    return this.occupationForm.get("startYear")
  }
  get OendYear() {
    return this.occupationForm.get("endYear")
  }
  get Otitle() {
    return this.occupationForm.get("title")
  }
  get Ospecialization() {
    return this.occupationForm.get("specialization")
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
