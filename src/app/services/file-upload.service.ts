import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';




@Injectable({
  providedIn: 'root'
})

export class FileUploadService {

  constructor(private http: HttpClient) {

  }

  uploadFile( file: File,userId:string) {
    const f: FormData = new FormData();
    f.append("file", file)
    f.append("id", userId)



    return this.http.post("http://localhost:8080/api/users/fileUpload", f,{responseType:'text',reportProgress:true,observe:'events'}).toPromise();
  }

}
