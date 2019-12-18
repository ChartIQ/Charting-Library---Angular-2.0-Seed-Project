import {
	Component,
	OnInit,
	ViewEncapsulation,
	ViewChild,
	ElementRef,
	ChangeDetectionStrategy,
} from '@angular/core';

import { Observable } from 'rxjs';

import { ChartService, ConfigService } from '../../services';

@Component({
	selector: 'chart',
	templateUrl: './chart.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit {
	$chartSeries: Observable<Array<any>>;
	height = 300;
	toolbarVisible = false;

	@ViewChild('chartContainer', { static: true }) domContainer: ElementRef;

	constructor(
		private chartService: ChartService,
		private config: ConfigService
	) {}

	ngOnInit() {
		const { symbol, layout, refreshInterval } = this.config;

		this.$chartSeries = this.chartService.$chartSeries;
		const container = this.domContainer.nativeElement;
		this.chartService.$toolbarActive.subscribe(isOn => {
			this.height = isOn ? 300 : 250;
		});

		this.chartService.createChart(container, {
			symbol,
			...layout,
			refreshInterval,
		});
	}

	showToolbar(value: boolean) {
		this.toolbarVisible = value;
	}

	removeSeries(series) {
		this.chartService.removeSeries(series);
	}

	ngOnDestroy() {
		this.chartService.destroyChart();
	}
}
