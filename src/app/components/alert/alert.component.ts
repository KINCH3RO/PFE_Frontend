import { Component, OnInit } from '@angular/core';
import { EventemitterService } from 'src/app/services/eventemitter.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  constructor(private eventEmitterService: EventemitterService) { }

  ngOnInit(): void {
    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeFirstComponentFunction.subscribe((parameters:object) => {    
        this.show(parameters);    
      });    
    }    
  }
  toShow=false;
  popUpType="success"
  message="test message";

  show(parameters){
    this.toShow=true;
    this.message=parameters.message;
    this.popUpType=parameters.type;
    if(parameters.time==null){
      setTimeout(()=>this.toShow=false,3000)
    }else{
      setTimeout(()=>this.toShow=false,parameters.time)
    }
 
    
  }
}
