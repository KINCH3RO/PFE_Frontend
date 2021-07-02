import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let roles = route.data.roles as Array<string>;
    let exist =typeof route.data.exist =='boolean' ? route.data.exist as boolean : true;
   
    if (exist==true) {

      for (let i = 0; i < roles.length; i++) {
        if (this.auth.containRole(roles[i])) {
          return true;
        }

      }
      return false;
    } else {
 
      for (let i = 0; i < roles.length; i++) {
        if (this.auth.containRole(roles[i])) {
          return false;
        }

      }
      return true;
    }

  }

  constructor(private auth: AuthService) {

  }
}
