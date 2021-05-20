import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
   this.data=["f","f","fff"]
  }

  @Input() data;
  value:string;

  setValue(val){
    this.value=val;
  }

  

}
