import {Component, OnInit} from '@angular/core';
import {ChartService} from '../chart_service/chart.service';

import * as _exports from '../../chartiq_library/js/chartiq';

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
    this.CIQ = CIQ;
    this.ciq = new CIQ.ChartEngine({ container: $$$("#chartContainer")});
    this.ciq.setPeriodicityV2(1, 5);
    this.chartService.attachQuoteFeed(this.ciq);
    this.ciq.newChart("IBM");
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
