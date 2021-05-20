import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, SelectMultipleControlValueAccessor, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
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
    private auth: AuthService,
    private userS: UserService,
    private roleSer: RoleService,
    private eventEmitter: EventemitterService,
    private fb: FormBuilder,
    private actRoute: ActivatedRoute,
    private fileUpload: FileUploadService,
    private elem: ElementRef) { }

  currenTuser: User;
  userId: number;
  profilePic: string;
  roles: Observable<any>
  isAdmin:boolean=true;

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
      this.oldPassword.setValue("");
      this.newPassword.setValue("");
    }).catch(err => {
      this.eventEmitter.showPopUP({
        type: "error", message: err.error
      })
    })
  }

  async updateAccountPreInfo() {
    let newRoles:Role[] = []
    let checkedElements=0;

    var updatedUser: User = new User(this.currenTuser);
    updatedUser.accountStatus = this.accountStatus.value;

    var rolesControls = this.elem.nativeElement.querySelectorAll('.roles');
    updatedUser.role.length=0
    rolesControls.forEach(element => {
      if (element.checked) {
        checkedElements++;
 
        updatedUser.role.push({ idRole: element.id })
      }
    });

    if(checkedElements==0){
      this.eventEmitter.showPopUP({ type: "warning", message: "Please check a role" })
      return;
    }
    
  
 

    await this.userS.updateUser(updatedUser).toPromise().then(data => {
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


    var selectedFile: File = event.target.files[0];
    await this.fileUpload.uploadFile(selectedFile, this.currenTuser.idUser.toString()).then(data => {

      this.eventEmitter.showPopUP({ type: "info", message: "your image has been uploaded succesfully" })




    }).catch(err => {
      console.log(err)
      this.eventEmitter.showPopUP({ type: "error", message: err.error })
    });

    //update user photo
    var updatedUser: User = new User(this.currenTuser);


    updatedUser.profilePhotoUrl = "/static/UploadedFiles/Images/profilePic" + this.currenTuser.idUser + '.' + selectedFile.name.split('.').pop();;
    this.profilePic = "";


    //update the DOM




    await this.userS.updateUser(updatedUser).toPromise().catch(err => {
      this.eventEmitter.showPopUP({
        type: "error", message: err.error
      })
    })
    await new Promise(r => setTimeout(r, 5000));
    this.profilePic = "http://localhost:8080/api" + updatedUser.profilePhotoUrl
  }
}
