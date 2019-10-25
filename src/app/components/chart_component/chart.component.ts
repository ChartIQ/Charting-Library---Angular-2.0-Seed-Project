import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CIQ } from 'chartiq/js/chartiq';
import { ChartService } from '../../chart_service/chart.service';

@Component({
	selector: 'chart',
	templateUrl: './chart.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [ChartService],
})
export class ChartComponent implements OnInit {
	ciq: any;
	sampleData: any[];
	chartSeries: any[] = [];

	constructor(private chartService: ChartService) {}

	ngOnInit() {
		this.ciq = new CIQ.ChartEngine({
			container: document.querySelector('.chartContainer'),
		});
		this.ciq.setPeriodicityV2(1, 5);
		this.chartService.attachQuoteFeed(this.ciq);
		this.ciq.newChart('IBM');
		// Comment this line in to add the tooltip when crosshairs are enabled
		// new CIQ.Tooltip({ stx: this.ciq, ohl: true });
	}

	ngOnDestroy() {
		// This will remove the quoteDriver, styles and
		// eventListeners for this ChartEngine instance.
		this.ciq.destroy();
	}

	getLayout() {
		return this.ciq.layout;
	}

	removeSeries(series) {
		var index = this.chartSeries.indexOf(series, 0);
		if (index > -1) {
			this.chartSeries.splice(index, 1);
		}
		this.ciq.removeSeries(series.display, this.ciq.ciq);
	}

	set(multiplier, span) {
		var params = {
			multiplier: multiplier,
			span: span,
		};
		this.ciq.setSpan(params, function() {});
	}
}
