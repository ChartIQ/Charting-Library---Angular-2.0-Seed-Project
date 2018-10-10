import {Component, OnInit} from '@angular/core';
import {ChartService} from '../chart_service/chart.service';

import * as _exports from '../../chartiq_library/js/chartiq';
// For market depth charts ONLY load these TWO files
// Do not try and load cryptoiq.js, it is for webcomponents
// place the files at the end of these paths to make them work correctly
// or configure webpack to load them from the plugins folder and make chartiq available to marketdepth as dependency
import '../../chartiq_library/js/thirdparty/splines'
import '../../chartiq_library/js/marketdepth'

let CIQ:any = _exports.CIQ;
let $$$:any = _exports.$$$;

@Component({
  selector: 'chart',
  styleUrls: ['../css/CIQ_Seed.css'],
  templateUrl: './chart.component.html',
  providers: [ChartService]
})

export class ChartComponent implements OnInit {
  CIQ: any;
  ciq: any;
  sampleData: any[];
  chartSeries:any[];

  constructor(private chartService: ChartService) {
    this.chartSeries=[];
  };

  ngOnInit() {
    this.CIQ = CIQ
    this.ciq = new CIQ.ChartEngine({ container: $$$("#chartContainer")});
    // In this example we're creating static market depth chart, no attaching other quoteFeeds or setting a default periodicity
    // to load market depth charts this is all  that needs to be done to load it as the main chart
    this.ciq.setChartType("step_marketdepth");
    this.ciq.chart.tension=0.5;
    this.ciq.manageTouchAndMouse=false;
    this.ciq.newChart("Market Depth", [], null,null,{periodicity:{interval:'tick'}});
    // Sample data
    var newData={
    DT:new Date("2018-07-30T04:00:00.000Z"),
    Last:24.2589,
    Bid:100.92,
    BidSize:29,
    Ask:101.22,
    AskSize:226,
    BidL2:
      [
      [93.54,5],[93.65,2],[93.95,7],[95.36,2],
      [95.97,9],[96.58,1], [96.68, 8], [96.98, 4],
      [97.08, 5], [97.18, 5], [97.28, 3], [97.38, 5],
      [97.48, 6], [97.69, 26], [98.29, 5], [98.39, 33],
      [98.49, 13], [98.6, 42], [98.8, 13], [98.9, 1]
      ],

    AskL2:
      [
      [101.22,226],[101.32,31],[101.42,13],[101.53,188],
      [101.63,8],[101.73,5],[101.83,16],[101.93,130],
      [102.03,9],[102.13,122],[102.23,5],[102.33,5],
      [102.43,7],[102.54,9],[102.84,3],[102.94,92],
      [103.04,7],[103.24,4],[103.34,7],[103.44,6]
      ]
    }

    // Call these 2 lines as often as you wish to refresh the data.
    this.ciq.updateCurrentMarketData(newData);
    this.ciq.draw();
  }

  // https://angular.io/docs/ts/latest/api/core/index/OnDestroy-class.html
  ngOnDestroy() {
    // This will remove the quoteDriver, styles and
    // eventListeners for this ChartEngine instance.
    this.ciq.destroy();
  }

  getLayout() {
    return this.ciq.layout;
  }

  removeSeries(series){
    var index = this.chartSeries.indexOf(series, 0);
    if (index > -1) {
      this.chartSeries.splice(index, 1);
    }
    this.ciq.removeSeries(series.display, this.ciq.ciq);
  }

  set(multiplier, span){
    var params={
      multiplier:multiplier,
      span:span,
    };
    this.ciq.setSpan(params, function(){
      console.log("span set");
    });
  };
}
