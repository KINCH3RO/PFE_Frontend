import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';




@Injectable({
  providedIn: 'root'
})

export class FileUploadService {

  constructor(private http: HttpClient) {

  }

  uploadFile( file: File) {
    const f: FormData = new FormData();
    f.append("file", file)
    return this.http.post("http://localhost:8080/api/users/fileUpload", f,{responseType:'text'}).toPromise();
  }


  uploadFileOffers( file: File) {
    const f: FormData = new FormData();
    f.append("file", file)
  



    return this.http.post("http://localhost:8080/api/services/fileUpload", f,{responseType:'text'}).toPromise();
  }

  uploadFileEntreprise( file: File) {
    const f: FormData = new FormData();
    f.append("file", file)
  



    return this.http.post("http://localhost:8080/api/entreprises/fileUpload", f,{responseType:'text'}).toPromise();
  }


  



  

 


}
