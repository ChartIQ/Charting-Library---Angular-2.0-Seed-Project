import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

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
	showToolbar = false;
	@ViewChild('chartContainer', { static: true }) domContainer: ElementRef;

	constructor(private chartService: ChartService) {}

	ngOnInit() {
		this.ciq = new CIQ.ChartEngine({
			container: this.domContainer.nativeElement,
		});
		this.ciq.setPeriodicity({ period: 5, interval: 'minute' });
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

	setToolbar(value: boolean) {
		this.showToolbar = value;
	}

	addSeries(series) {
		this.chartSeries.push(series);
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
