import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Entreprise } from '../models/entreprise';
import { Recruitments } from '../models/recruitments';

// Declare SockJS and Stomp
//socket

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  constructor(private http: HttpClient) { }


  addEntreprise(value) {
    return this.http.post<Entreprise>("http://localhost:8080/api/entreprises/add", value)
  }

  updateEntreprise(value) {
    return this.http.put<Entreprise>("http://localhost:8080/api/entreprises/update", value)
  }

  getEntreprise(id: number) {
    return this.http.get<Entreprise>("http://localhost:8080/api/entreprises/" + id)
  }

  deleteEntreprise(id: number) {
    return this.http.delete<Entreprise>("http://localhost:8080/api/entreprises/delete/" + id)
  }

  getAll() {
    return this.http.get<Entreprise[]>("http://localhost:8080/api/entreprises/all")
  }

  getAllPaginEntrepriseByOwner(pageSize, pageNumber, ownerID, title = "", sortAsc = false) {
    var url = `http://localhost:8080/api/entreprises/?pageNumber=${pageNumber}&pageSize=${pageSize}&title=${title}&ownerID=${ownerID}&sortAsc=${sortAsc}`

    return this.http.get<Entreprise[]>(url);
  }

  getAllPaginEntreprise(pageSize, pageNumber, title = "", sortAsc = false) {
    var url = `http://localhost:8080/api/entreprises/?pageNumber=${pageNumber}&pageSize=${pageSize}&title=${title}&sortAsc=${sortAsc}`

    return this.http.get<Entreprise[]>(url);
  }


 
}
