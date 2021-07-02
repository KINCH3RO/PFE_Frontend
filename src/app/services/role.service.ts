import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http:HttpClient) { }

  getAllRoles(){
     return this.http.get("http://localhost:8080/api/roles/all")
  }

  getRoleByName(name:string){
    return this.http.get<Role>("http://localhost:8080/api/roles/roleName/"+name)
 }
  getAllPaginRoles(pageSize,pageNumber,name=""){
    var url =`http://localhost:8080/api/roles/?pageSize=${pageSize}&pageNumber=${pageNumber}&roleName=${name}`
  
    return this.http.get<Role[]>(url);
  }

  addRole(role:Role){
    return this.http.post<Role>("http://localhost:8080/api/roles/add",role);
  }
  updateRole(role:Role){
    return this.http.put<Role>("http://localhost:8080/api/roles/update",role);
  }
  deleteRole(id){
    return this.http.delete("http://localhost:8080/api/roles/delete/"+id,{responseType:'text'});
  }
}
