import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  signUpForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    familyName: ['', [Validators.required, Validators.minLength(3)]],
    userName: ['', [Validators.required, Validators.minLength(6)]],
    bornDate: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]

  })
  recoverForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]

  })
  signInForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })


  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder, private auth: AuthService, private router: Router,
    private eventEmitter: EventemitterService) {
    this.show("login");

  }
  formToShow = "login";
  upperText = "Sign in";
  subText = "Sign in to access your account";
  ngOnInit(): void {

    this.show(this.activatedRoute.snapshot.paramMap.get('formName'))
  }


  show(value) {
    this.formToShow = value;
    if (this.formToShow == "signUp") {
      this.upperText = "Sign Up";
      this.subText = "Join wadifa and discover the market now";

    } else if (this.formToShow == "recover") {
      this.upperText = "Recover password";
      this.subText = "Please provide your Email";
    } else {
      this.upperText = "Sign in";
      this.subText = "Sign in to access your account";
      this.formToShow = "login";
    }
  }
  //sign in form
  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }

  //sign up form
  get name() {
    return this.signUpForm.get('name');
  }
  get familyname() {
    return this.signUpForm.get('familyName');
  }
  get username() {
    return this.signUpForm.get('userName');
  }

  get borndate() {
    return this.signUpForm.get('bornDate');
  }

  get emailUp() {
    return this.signUpForm.get('email');
  }

  get passwordUp() {
    return this.signUpForm.get('password');
  }



  //recover form

  get emailRe() {
    return this.recoverForm.get('email');
  }

  async login() {
    if (this.signInForm.valid) {
      this.loading = true;
      await this.auth.login(this.signInForm.value).then(data => {
        if (data == true) {
          this.router.navigateByUrl("/")
        } else {
          this.eventEmitter.showPopUP({ type: "error", message: data, time: 5000 })
        }
      })
      this.loading = false;
    }
  }

  checkIfuserExist() {
    if (this.username.valid) {

      this.auth.checkIfuserNameExist(this.username.value);
    }


  }

  checkIfEmailExist() {
    if (this.emailUp.valid) {

      this.auth.checkIfEmailExist(this.emailUp.value);
    }
  }

  signUp() {


    if (this.signUpForm.valid) {
      this.loading = true;
      console.log(this.signUpForm.value)
      this.auth.signUp(this.signUpForm.value).then(data => {
        this.eventEmitter.showPopUP({ type: 'success', message: 'Registration has been completed \n please verify your email' })
        setTimeout(() => {
          this.loading = false

          this.router.navigateByUrl("/login")

        }, 3000)
      }).catch(err => {
        this.eventEmitter.showPopUP({ type: 'error', message: err.error })
        this.loading = false;
      });
    }


  }

}
