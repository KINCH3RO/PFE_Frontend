import { HttpClient } from '@angular/common/http';
import { isGeneratedFile } from '@angular/compiler/src/aot/util';
import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { BehaviorSubject } from 'rxjs';
import { Offer } from '../models/offer';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  isDegital = false;

  BASIC_INFO_KEY = "basic_info";
  PLANS_KEY = "plans_info";
  ASSETS_KEY = "assets_info";
  OFFER_TYPE_KEY = "type_info";
  pageNumber: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  setBasicInfo(value) {
    sessionStorage.setItem(this.BASIC_INFO_KEY, JSON.stringify(value))
  }

  setPlansInfo(value) {
    sessionStorage.setItem(this.PLANS_KEY, JSON.stringify(value))
  }

  getBasicInfo() {
    return JSON.parse(sessionStorage.getItem(this.BASIC_INFO_KEY));
  }

  getPlansInfo() {
    return JSON.parse(sessionStorage.getItem(this.PLANS_KEY))
  }

  setAssetsInfo(value) {
    sessionStorage.setItem(this.ASSETS_KEY, JSON.stringify(value))
  }

  getAssestsInfo() {
    return JSON.parse(sessionStorage.getItem(this.ASSETS_KEY))
  }

  setTypeInfo(value: boolean) {
    sessionStorage.setItem(this.OFFER_TYPE_KEY, value.toString())
  }

  getTypeInfo(): boolean {
    return JSON.parse(sessionStorage.getItem(this.OFFER_TYPE_KEY))
  }

  addService(value) {
    return this.http.post("http://localhost:8080/api/services/add", value)
  }

  addIRLService(value) {
    return this.http.post("http://localhost:8080/api/services/addIRL", value)
  }

  findAllByUser(userId: number) {
    return this.http.get("http://localhost:8080/api/services/allByUser/" + userId)
  }

  findOfferById(id:number){
    return this.http.get<Offer>("http://localhost:8080/api/services/" + id)
  }

  updateService(offer:Offer, degital:boolean){
    if(degital){
      return this.http.post<Offer>("http://localhost:8080/api/services/update",offer)
    }else{
      return this.http.post<Offer>("http://localhost:8080/api/services/updateIRL",offer)
    }
   
  }

  getAllPaginServices(pageSize,pageNumber,title="",isDegital=false){
    var url =`http://localhost:8080/api/services/?pageNumber=${pageNumber}&pageSize=${pageSize}&isDegital=${isDegital}&title=${title}`
  
    return this.http.get<Offer[]>(url);
  }

  getAllServicesByType(type:boolean, title=''){
    console.log("service"+ title);
    
    var url =`http://localhost:8080/api/services/isDegital/?type=${type}&title=${title}`
    
    return this.http.get<Offer[]>(url);
  }

  



  clearSessionStorage() {
    sessionStorage.removeItem(this.BASIC_INFO_KEY);
    sessionStorage.removeItem(this.PLANS_KEY);
    sessionStorage.removeItem(this.ASSETS_KEY)
  }
}
