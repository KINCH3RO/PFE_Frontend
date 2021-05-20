import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

 
  constructor(private http: HttpClient) {


  }
  getAllPaginUsers(pageSize,pageNumber,name="",familyname="",role=0){
    var url ="http://localhost:8080/api/users/?pageSize="+pageSize+"&pageNumber="+pageNumber
    
    
      url+="&name="+name;
    

      url+="&famName="+familyname;
      url+="&roleId="+role;
    
    return this.http.get<User[]>(url);
  }

  getAllUsers(){
    return this.http.get<User[]>("http://localhost:8080/api/users/all");
  }
 
  getUserById(id:number){
    return this.http.get<User>("http://localhost:8080/api/users/"+id);
  }
  
  updateUser(user:User){
    return this.http.put<User>("http://localhost:8080/api/users/update",user);
  }

  deleteUser(id){
    return this.http.delete("http://localhost:8080/api/users/delete/"+id,{responseType:'text'});
  }

}
