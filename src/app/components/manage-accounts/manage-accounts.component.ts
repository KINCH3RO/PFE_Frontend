import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-manage-accounts',
  templateUrl: './manage-accounts.component.html',
  styleUrls: ['./manage-accounts.component.css']
})
export class ManageAccountsComponent implements OnInit {

  constructor(private userS: UserService, private eventEmitter: EventemitterService, private auth: AuthService, private roleSer: RoleService) { }

  ngOnInit(): void {
    this.displayData();
   
  }
  currentAdminUser: User;
  showModal = false;
  deleteUserId: number;
  users: Observable<any>
  pageSize: number = 5;
  pageNumber: number = 0;
  selectedOption: number;
  name: string;
  famName: string;
  roles: Observable<any>
  selectedRole: number = 0;

  displayData() {
    // this.users = this.userS.getAllUsers()
    this.users = this.userS.getAllPaginUsers(this.pageSize, this.pageNumber, this.name, this.famName, this.selectedRole);
    this.roles = this.roleSer.getAllRoles();

  }

  openModal(id) {
    this.deleteUserId = id;
    this.showModal = true;
  }
  closeModal() {
    this.deleteUserId = undefined;
    this.showModal = false;
  }
  deleteUser() {
    if (this.deleteUserId == this.auth.localUser().idUser) {
      this.eventEmitter.showPopUP({ type: "info", message: "you cant delete your account" })
      this.closeModal();
      return;
    }

    this.userS.deleteUser(this.deleteUserId).toPromise().then(data => {
      this.eventEmitter.showPopUP({ type: "success", message: data })
    }).catch(err => {
      this.eventEmitter.showPopUP({ type: "error", message: err.error })
    })
    this.displayData();
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

  filterName() {

    this.displayData();
  }

}
