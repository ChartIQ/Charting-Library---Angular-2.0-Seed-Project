import {Component, ElementRef, EventEmitter, Output} from '@angular/core'

import * as _exports from '../../chartiq_library/js/chartiq';
var CIQ = _exports.CIQ;

@Component({
  selector: 'overlay-menu',
  styleUrls:['../css/CIQ_Seed.css'],
  templateUrl: './overlay.menu.html',
})

export class OverlayMenu{
  left:any=0;
  top:any=0;
  ciq:any;
  sd:any;
  launchMenu:any=false;
  @Output() launchStudyDialog:EventEmitter<any>=new EventEmitter();
  @Output() removeStudy:EventEmitter<any>=new EventEmitter();


  constructor(public element:ElementRef){}

  closeMe(){
    this.launchMenu=null;
  };

  launchMe=function(params){
    this.launchMenu=true;
    this.top=params.ciq.cy+'px';
    this.left=params.ciq.cx+'px';
    this.ciq=params.ciq;
    this.sd=params.sd;
  };

  clickHandler(event){
    if(event=='edit'){
      this.launchStudyDialog.emit({sd:this.sd, stx:this.ciq});
    }
    else{
      this.removeStudy.emit({sd:this.sd, stx:this.ciq});
    }
    this.closeMe();
  };
}
