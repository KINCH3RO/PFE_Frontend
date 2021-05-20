import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventemitterService {

  constructor() { }

  invokeFirstComponentFunction = new EventEmitter();    
  subsVar: Subscription;    
    
 
    
  showPopUP(parameters) {    
    this.invokeFirstComponentFunction.emit(parameters);    
  }    
}
