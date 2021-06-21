import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Entreprise } from 'src/app/models/entreprise';

import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { EventemitterService } from 'src/app/services/eventemitter.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-my-entreprises',
  templateUrl: './my-entreprises.component.html',
  styleUrls: ['./my-entreprises.component.css']
})
export class MyEntreprisesComponent implements OnInit {

  constructor(private entrepriseSer: EntrepriseService,
    private auth: AuthService,
    private eventEmitter: EventemitterService) { }

  env;
  entreprises: Observable<Entreprise[]>
  pageSize = 4;
  pageNumber = 0;
  title;
  showModal = false;
  selectedEntreprise: number = -1;
  sortAsc = false;

  loadMore() {
    this.pageSize += 4;
    this.displayData();

  }
  closeModal() {
    this.showModal = false;
  }
  deleteEntreprise() {
    if (this.selectedEntreprise != -1) {
      this.entrepriseSer.deleteEntreprise(this.selectedEntreprise).toPromise().then(data => {
        this.eventEmitter.showPopUP({ message: "Entreprise  has been deleted succesfully", type: "success" })
        this.showModal = false
        this.displayData();
      }).catch(err => {
        this.eventEmitter.showPopUP({ message: "An error occured", type: "error" })
        console.log(err);
        this.showModal = false
      })
    }

   }


  ngOnInit(): void {
    this.env=environment;
    this.displayData();
    


  }

  displayData() {
    let userId = parseInt(this.auth.localUserId());
    if (!userId) {
      return;
    }
    this.entreprises = this.entrepriseSer.getAllPaginEntrepriseByOwner(this.pageSize, this.pageNumber, userId, this.title, this.sortAsc);


  }



}
