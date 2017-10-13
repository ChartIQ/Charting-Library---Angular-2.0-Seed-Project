import {Component, NgZone, Output, EventEmitter} from '@angular/core'
import {Colorpicker} from '../colorpicker_component/colorpicker'

import * as _exports from '../../chartiq_library/js/chartiq';
var CIQ = _exports.CIQ;

@Component({
  selector: 'theme-dialog',
  styleUrls:['../css/CIQ_Seed.css'],
  templateUrl: './theme.dialog.component.html',
  providers:[Colorpicker]
})

export class ThemeDialog{
  ciq:any;
  zone:NgZone;
  activeOutput:any={};
  themeHelper:any={};
  themeName:string;
  @Output() themeToPush=new EventEmitter<any>();
  @Output() launchDialog=new EventEmitter<any>();
  @Output() launchColorpickerEvent=new EventEmitter<any>();

  constructor() {
    this.zone = new NgZone({enableLongStackTrace: false});
  }

  updateTheme(theme){
    if(theme.name=="Default"){
      this.themeHelper=new CIQ.ThemeHelper({'stx':this.ciq});
    }
    this.zone.run(()=> {
      this.themeHelper.settings = theme.settings;
      this.themeHelper.update();
    });
  }

  updateThemeHelper=function(color,themeDetail){
    switch (themeDetail){
      case 'candleUp':
        this.themeHelper.settings.chartTypes["Candle/Bar"].up.color=CIQ.hexToRgba('#'+color);
        break;
      case 'candleDown':
        this.themeHelper.settings.chartTypes["Candle/Bar"].down.color=CIQ.hexToRgba('#'+color);
        break;
      case 'wickUp':
        this.themeHelper.settings.chartTypes["Candle/Bar"].up.wick=CIQ.hexToRgba('#'+color);
        break;
      case 'wickDown':
        this.themeHelper.settings.chartTypes["Candle/Bar"].down.wick=CIQ.hexToRgba('#'+color);
        break;
      case 'borderUp':
        this.themeHelper.settings.chartTypes["Candle/Bar"].up.border=CIQ.hexToRgba('#'+color);
        break;
      case 'borderDown':
        this.themeHelper.settings.chartTypes["Candle/Bar"].down.border=CIQ.hexToRgba('#'+color);
        break;
      case 'lineBar':
        this.themeHelper.settings.chartTypes["Line"].color=CIQ.hexToRgba('#'+color);
        break;
      case 'mountain':
        this.themeHelper.settings.chartTypes["Mountain"].color=CIQ.hexToRgba('#'+color);
        break;
      case 'chartBackground':
        this.themeHelper.settings.chart["Background"].color=CIQ.hexToRgba('#'+color);
        break;
      case 'dividers':
        this.themeHelper.settings.chart["Grid Dividers"].color=CIQ.hexToRgba('#'+color);
        break;
      case 'lines':
        this.themeHelper.settings.chart["Grid Lines"].color=CIQ.hexToRgba('#'+color);
        break;
      case 'axis':
        this.themeHelper.settings.chart["Axis Text"].color=CIQ.hexToRgba('#'+color);
        break;
    }
  };

  showDialog=function(chart){
    this.ciq=chart;
    this.zone.run(()=>{
      this.themeHelper=new CIQ.ThemeHelper({'stx':this.ciq});
      this.candleUp=this.themeHelper.settings.chartTypes["Candle/Bar"].up;
      this.candleDown=this.themeHelper.settings.chartTypes["Candle/Bar"].down;
      this.lineBarChart=this.themeHelper.settings.chartTypes["Line"];
      this.mountainChart=this.themeHelper.settings.chartTypes["Mountain"];
      this.axis=this.themeHelper.settings.chart["Axis Text"];
      this.background=this.themeHelper.settings.chart["Background"];
      this.gridDividers=this.themeHelper.settings.chart["Grid Dividers"];
      this.gridLines=this.themeHelper.settings.chart["Grid Lines"];
      this.launchDialog.emit(true);
    });
  };

  launchColorpicker(setting, event){
    this.activeOutput['div']=event.target;
    this.launchColorpickerEvent.emit({
      swatch: event.target,
      setting:setting
    });
  }

  setColorFromPicker(params){
    this.updateThemeHelper(params.color, params.params);
    this.activeOutput.div.style.backgroundColor=CIQ.hexToRgba('#'+params.color);
  }

  closeMe=function(saveTheme){
    if(saveTheme){
      var clone=CIQ.clone(this.themeHelper.settings);
      var newTheme={'name':this.themeName,'settings':clone};
      this.themeToPush.emit(newTheme);
      this.updateTheme(newTheme);
    }
    this.launchDialog.emit(false);
  };
}
