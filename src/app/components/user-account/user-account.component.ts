import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, SelectMultipleControlValueAccessor, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { EmailService } from 'src/app/services/email.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private userS: UserService,
    private roleSer: RoleService,
    private eventEmitter: EventemitterService,
    private fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private fileUpload: FileUploadService,
    private elem: ElementRef,
    private emailSender: EmailService) { }

  currenTuser: User;
  userId: number;
  profilePic: string;
  roles: Observable<any>
  showModal = false;
  paramValue;


  emailForm = this.fb.group({

    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]],

  })

  get subject() {
    return this.emailForm.get('subject');
  }
  get message() {
    return this.emailForm.get('message');
  }
  personalForm: FormGroup = this.fb.group({
    idUser: [''],
    name: ['', [Validators.required, Validators.minLength(3)]],
    familyName: ['', [Validators.required, Validators.minLength(6)]],
    userName: ['', [Validators.required, Validators.minLength(6)]],
    bornDate: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],

  })

  securityForm: FormGroup = this.fb.group({

    oldPassword: ['', [Validators.required, Validators.minLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],


  })

  accountPreForm: FormGroup = this.fb.group({

    accountStatus: ['', [Validators.required, Validators.minLength(6)]],
  })





  ngOnInit(): void {

    this.displayData();
  }

  async displayData() {
    this.paramValue = parseInt(this.actRoute.snapshot.paramMap.get("id")) ? parseInt(this.actRoute.snapshot.paramMap.get("id")) : null;
    this.userId = parseInt(this.actRoute.snapshot.paramMap.get("id")) ? parseInt(this.actRoute.snapshot.paramMap.get("id")) : parseInt(JSON.parse(localStorage.getItem(this.auth.storageKey)).idUser)

    await this.userS.getUserById(this.userId).toPromise().then(data => {
      this.currenTuser = data;
    }).catch(err => {
      this.eventEmitter.showPopUP({ type: "error", message: "User not found " })
    });

    this.personalForm.setValue(
      {
        idUser: this.currenTuser.idUser,
        name: this.currenTuser.name,
        familyName: this.currenTuser.familyName,
        userName: this.currenTuser.userName,
        bornDate: new Date(this.currenTuser.bornDate).toISOString().substring(0, 10),
        email: this.currenTuser.email

      }
    )
    if (this.currenTuser.profilePhotoUrl) {

      this.profilePic = "http://localhost:8080/api" + this.currenTuser.profilePhotoUrl;
    }

    this.roles = await this.roleSer.getAllRoles();

    this.accountPreForm.setValue({
      accountStatus: this.currenTuser.accountStatus

    })




  }


  async updatePersonalInfo() {
    if (!this.personalForm.valid) {
      return;
    }
    var updatedUser: User = new User(this.currenTuser);

    updatedUser.name = this.name.value;
    updatedUser.familyName = this.familyname.value;
    updatedUser.userName = this.username.value;
    updatedUser.bornDate = this.borndate.value;
    updatedUser.email = this.emailUp.value;

    if (updatedUser.email != this.emailUp.value) {
      updatedUser.isEmailVerified = false;
    }

    console.log(updatedUser)
    console.log(this.currenTuser);

    await this.userS.updateUser(updatedUser).toPromise().then(data => {
      this.eventEmitter.showPopUP({ type: "success", message: "Your personnal info has been updated" })
    }).catch(err => {
      this.eventEmitter.showPopUP({
        type: "error", message: err.error
      })
    })
  }

  async updateSecurityInfo() {

    if (!this.securityForm.valid) {
      return;
    }
    if (this.oldPassword.value != this.currenTuser.password) {
      this.eventEmitter.showPopUP({ type: "warning", message: "Old password is incorrect" })
      return
    }

    var updatedUser: User = new User(this.currenTuser);
    updatedUser.password = this.newPassword.value;

    await this.userS.updateUser(updatedUser).toPromise().then(data => {
      this.eventEmitter.showPopUP({ type: "success", message: "Your personnal info has been updated" })
      this.securityForm.reset();
    }).catch(err => {
      this.eventEmitter.showPopUP({
        type: "error", message: err.error
      })
    })
  }

  updateAccountPreInfo() {
    let newRoles: Role[] = []
    let checkedElements = 0;

    var updatedUser: User = new User(this.currenTuser);
    updatedUser.accountStatus = this.accountStatus.value;


    if (updatedUser.accountStatus != "normal" && updatedUser.accountStatus != this.currenTuser.accountStatus && this.currenTuser.idUser != this.auth.localUserId()) {

      this.showModal = true;
      this.subject.setValue("your account has been " + updatedUser.accountStatus)
    }


    var rolesControls = this.elem.nativeElement.querySelectorAll('.roles');
    updatedUser.role.length = 0
    rolesControls.forEach(element => {
      if (element.checked) {
        checkedElements++;

        updatedUser.role.push({ idRole: element.id, roleName: element.name })
      }
    });

    if (checkedElements == 0) {
      this.eventEmitter.showPopUP({ type: "warning", message: "Please check a role" })
      return;
    }

    let mappedRoles = updatedUser.role.map(x => x.roleName)

    if (!mappedRoles.includes("ADMIN") && this.currenTuser.idUser == this.auth.localUserId()) {
      this.eventEmitter.showPopUP({ type: "info", message: "You cant remove admin role from yourself" })
      return;
    }
    if (mappedRoles.includes("ADMIN") && mappedRoles.includes("SUPPORT") ||
      mappedRoles.includes("USER_ADMIN") && mappedRoles.includes("SUPPORT")) {
      this.eventEmitter.showPopUP({ type: "info", message: "User cannot has Administratif role and Support role" })
      return;
    }

    if (mappedRoles.includes("ADMIN") && mappedRoles.includes("SELLER") ||
      mappedRoles.includes("USER_ADMIN") && mappedRoles.includes("SELLER")) {
      this.eventEmitter.showPopUP({ type: "info", message: "User cannot has Administratif role and Seller role" })
      return;
    }

    if (mappedRoles.includes("ADMIN") && mappedRoles.includes("BUYER") ||
      mappedRoles.includes("USER_ADMIN") && mappedRoles.includes("BUYER")) {
      this.eventEmitter.showPopUP({ type: "info", message: "User cannot has Administratif role and Buyer role" })
      return;
    }





    this.userS.updateUser(updatedUser).toPromise().then(data => {
      this.eventEmitter.showPopUP({ type: "success", message: "account status info has been updated" })

    }).catch(err => {
      this.eventEmitter.showPopUP({
        type: "error", message: err.error
      })
    })
  }


  containRole(roleId): boolean {
    if (this.currenTuser.role.find(x => x.idRole == roleId)) {
      return true;
    }
    return false;
  }

  get accountStatus() {
    return this.accountPreForm.get('accountStatus');
  }

  get name() {
    return this.personalForm.get('name');
  }


  get familyname() {
    return this.personalForm.get('familyName');
  }
  get username() {
    return this.personalForm.get('userName');
  }

  get borndate() {
    return this.personalForm.get('bornDate');
  }

  get emailUp() {
    return this.personalForm.get('email');
  }

  get oldPassword() {
    return this.securityForm.get('oldPassword');
  }

  get newPassword() {
    return this.securityForm.get('newPassword');
  }

  //image upload

  openFile() {

    let element: HTMLElement = document.getElementById("file") as HTMLElement;
    element.click();

  }

  async onFileSelected(event) {

    //update user photo
    var updatedUser: User = new User(this.currenTuser)
    this.profilePic = "";
    var selectedFile: File = event.target.files[0];
    await this.fileUpload.uploadFile(selectedFile).then(data => {

      this.eventEmitter.showPopUP({ type: "info", message: "your image has been uploaded succesfully" })
      console.log(data);

      updatedUser.profilePhotoUrl = "/static/UploadedFiles/Images/" + data;
      this.userS.updateUser(updatedUser).toPromise().catch(err => {
        this.eventEmitter.showPopUP({
          type: "error", message: err.error
        })
      })



    }).catch(err => {
      console.log(err)
      this.eventEmitter.showPopUP({ type: "error", message: err.error })
    });


    await new Promise(r => setTimeout(r, 5000))
    //update the DOM
    this.profilePic = "http://localhost:8080/api" + updatedUser.profilePhotoUrl


  }

  sendEmail() {
    if (this.emailForm.valid) {
      this.emailSender.sendEmail(this.subject.value, this.message.value, this.currenTuser.email).toPromise().then(data => {
        this.eventEmitter.showPopUP({ type: "info", message: "email has been sent succesfully" })
      }).catch(err => {
        this.eventEmitter.showPopUP({ type: "error", message: "error occured sending email" })
      });
      this.showModal = false;
    }
  }
}
