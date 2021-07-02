import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { EventemitterService } from '../services/eventemitter.service';
import { ProfileService } from '../services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
  
    let returnedValue = false;
    await this.profileSer.getProfileByUser(this.auth.localUser()).toPromise().then(data => {
      if(data.blocked){
        this.eventEmitter.showPopUP({message:"Your profile is blocked !! you can't access this service",type:"info"})
      }
      returnedValue = !data.blocked;
    }).catch()
    return returnedValue;
  }
  constructor(private auth: AuthService, private profileSer: ProfileService, private eventEmitter: EventemitterService) { }

}
