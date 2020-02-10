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

		// Once the chart is created move comparison into engine created legend container
		// to make sure of proper positioning when panels or yAxes are re-arranged
		// currently there does not appear to be an ideomatic Angular way of doing it
		// resolving to DOM node re-positioning
		const comparisons = container.querySelector('.comparisons');
		const legend = container.querySelector('.stx-panel-chart .stx-panel-legend');

		legend.appendChild(comparisons);
		legend.style.display = 'block';
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
