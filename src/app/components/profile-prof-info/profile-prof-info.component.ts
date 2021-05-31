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
  selector: 'app-profile-prof-info',
  templateUrl: './profile-prof-info.component.html',
  styleUrls: ['./profile-prof-info.component.css']
})
export class ProfileProfInfoComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private countrySer: CountryService,
    private eventEmitter: EventemitterService,
    private userSer: UserService,
    private profileSer: ProfileService,
    private authSer: AuthService,
    private router:Router) { }

  ngOnInit(): void {
    this.profileSer.setPage(2);
    this.countries = this.countrySer.getAllCountries();
    this.displayData();
  }



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

  displayData() {
    this.userSer.getUserById(this.authSer.localUserId()).toPromise().then(data => {


      this.profileSer.getProfileByUser(data).toPromise().then(profile => {


        this.occupations = profile.occupations;
        this.certifications = profile.certifications;
        this.educations = profile.educations;




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

        profile.occupations = this.occupations;
        profile.certifications = this.certifications;
        profile.educations = this.educations;

        this.profileSer.updateProfile(profile).toPromise().then(data => {
          this.eventEmitter.showPopUP({ type: 'success', message: "profile has been updated" })
          this.router.navigateByUrl("/profileCreation/Aac")
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

  educationFrom: FormGroup = this.fb.group({
    id:[0,[]],
    country: ['', [Validators.required]],
    startYear: ['', [Validators.required, Validators.pattern(/^((20){1}|(19){1})[0-9]{2}$/)]],
    endYear: ['', [Validators.required, Validators.pattern(/^((20){1}|(19){1})[0-9]{2}$/)]],
    schoolName: ['', [Validators.required]],
    specialization: ['', [Validators.required]]
  })

  certificationForm: FormGroup = this.fb.group({
    id:[0,[]],
    name: ['', [Validators.required]],
    specialization: ['', [Validators.required]],
    certifiedFrom: ['', [Validators.required]],
    certificationDate: ['', [Validators.required]],

  })

  occupationForm: FormGroup = this.fb.group({
    id:[0,[]],
    country: ['', [Validators.required]],
    startYear: ['', [Validators.required, Validators.pattern(/^((20){1}|(19){1})[0-9]{2}$/)]],
    endYear: ['', [Validators.required, Validators.pattern(/^((20){1}|(19){1})[0-9]{2}$/)]],
    title: ['', [Validators.required]],
    specialization: ['', [Validators.required]]

  })


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


}
