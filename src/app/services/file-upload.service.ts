import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})

export class FileUploadService {

  constructor(private http: HttpClient) {

  }

  uploadFile(file: File) {
    const f: FormData = new FormData();
    f.append("file", file)
    return this.http.post("http://localhost:8080/api/users/fileUpload", f, { responseType: 'text' }).toPromise();
  }


  uploadFileOffers(file: File) {
    const f: FormData = new FormData();
    f.append("file", file)
    return this.http.post("http://localhost:8080/api/service/fileUpload", f, { responseType: 'text' }).toPromise();
  }

  uploadFileEntreprise(file: File) {
    const f: FormData = new FormData();
    f.append("file", file)
    return this.http.post("http://localhost:8080/api/entreprises/fileUpload", f, { responseType: 'text' }).toPromise();
  }

  uploadFileChat(file: File) {
    const f: FormData = new FormData();
    f.append("file", file)
    return this.http.post("http://localhost:8080/api/chats/fileUpload", f, { responseType: 'text' }).toPromise();
  }

  download(file: string | undefined) {
    return this.http.get("http://localhost:8080/api/" + file, {
      responseType: 'text'
    });
  }











}
