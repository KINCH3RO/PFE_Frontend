import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { Role } from 'src/app/models/role';

import { EventemitterService } from 'src/app/services/eventemitter.service';
import { RoleService } from 'src/app/services/role.service';


@Component({
  selector: 'app-role-settings',
  templateUrl: './role-settings.component.html',
  styleUrls: ['./role-settings.component.css']
})
export class RoleSettingsComponent implements OnInit {


  constructor(private eventEmitter: EventemitterService, private roleSer: RoleService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.displayData();
  }

  roleForm = this.fb.group({
    idRole: [0, [Validators.required]],
    roleName: ['ffff', [Validators.required, Validators.minLength(3)]],
    roleDescription: ['kkkkk', [Validators.required, Validators.minLength(10)]],
    creationDate: [new Date()]
  })



  showModal = false;
  showRoModal = false;
  deleteRoleId: number;
  paginRoles: Observable<any>
  pageSize: number = 4;
  pageNumber: number = 0;

  roleName: string;
  mandatoryRoles = ['ADMIN', 'USER_ADMIN', 'SUPPORT', 'USER']
  deleteRoleName: string;


  addRole = true;
  updateRole() {



    if (this.roleForm.valid) {


      if (this.addRole) {
        this.roleSer.addRole(this.roleForm.value).toPromise().then(data => {
          this.eventEmitter.showPopUP({ type: "success", message: "role has been added" })
          this.displayData();
        }).catch(err => {
          this.eventEmitter.showPopUP({ type: "error", message: err.error })
        })
      } else {
        this.name.enable();
        this.roleSer.updateRole(this.roleForm.value).toPromise().then(data => {
          this.eventEmitter.showPopUP({ type: "success", message: "role has been updated" })
          this.displayData();
        }).catch(err => {
          this.eventEmitter.showPopUP({ type: "error", message: err.error })
        })

      }
      this.closeRoleModal();


    }
  }

  displayData() {

    this.paginRoles = this.roleSer.getAllPaginRoles(this.pageSize, this.pageNumber, this.roleName)
    this.roleSer.getAllPaginRoles(this.pageSize, this.pageNumber, this.roleName).subscribe(data => console.log(data))


  }

  openModal(id, roleName) {
    this.deleteRoleId = id;
    this.deleteRoleName = roleName;

    if (this.mandatoryRoles.includes(this.deleteRoleName)) {

      this.eventEmitter.showPopUP({ type: "info", message: "You can't delete a mandatory role" })

      this.closeModal();
      return;
    }
    this.showModal = true;
  }


  closeModal() {
    this.deleteRoleId = undefined;
    this.deleteRoleName = undefined;
    this.showModal = false;
  }

  showRoleModal(role: Role = null) {
    if (role) {
      this.idRole.setValue(role.idRole)
      this.name.setValue(role.roleName)
      this.description.setValue(role.roleDescription)
      this.creationDate.setValue(role.creationDate)
      if (this.mandatoryRoles.includes(role.roleName)) {
        this.name.disable();

      }
      this.addRole = false;
    } else {

      this.idRole.setValue(0)
      this.name.setValue('')
      this.description.setValue('')
      this.creationDate.setValue(new Date())
      this.name.enable();
      this.addRole = true;
    }

    this.showRoModal = true;
  }

  closeRoleModal() {
    this.showRoModal = false;
  }


  deleteRole() {


    this.roleSer.deleteRole(this.deleteRoleId).toPromise().then(data => {
      this.eventEmitter.showPopUP({ type: "success", message: data })
      this.displayData();
    }).catch(err => {
      this.eventEmitter.showPopUP({ type: "error", message: err.error })
    })


    this.closeModal();
  }

  incrementPages() {
    this.pageNumber++;
    this.displayData();
  }

  decrementPages() {
    this.pageNumber--;
    this.displayData();
  }

  filter() {

    this.displayData();
  }

  get idRole() {
    return this.roleForm.get('idRole')

  }

  get description() {
    return this.roleForm.get('roleDescription')

  }

  get name() {
    return this.roleForm.get('roleName')
  }

  get creationDate() {
    return this.roleForm.get('creationDate')
  }

}
