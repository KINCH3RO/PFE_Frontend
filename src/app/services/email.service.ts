import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  sendEmail(subject:string,message:string,receiver:string){
    return this.http.get(`http://localhost:8080/api/mail/send?subject=${subject}&to=${receiver}&text=${message}`,{responseType:"text"})
  }
}
