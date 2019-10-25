import {
	Component,
	ViewChild,
	AfterViewChecked,
	ChangeDetectionStrategy,
	NgZone,
} from '@angular/core';
import { ChartComponent } from '../chart_component/chart.component';
import { StudyDialog } from '../study_dialog_component/study.dialog.component';
import { ThemeDialog } from '../theme_dialog_component/theme.dialog.component';
import { TimezoneDialog } from '../timezone_dialog_component/timezone.dialog.component';
import { Colorpicker } from '../colorpicker_component/colorpicker';
import { OverlayMenu } from '../overlay_menu_component/overlay.menu';

import { CIQ } from 'chartiq';

@Component({
	selector: 'chart-ui',
	templateUrl: './ui.component.html',
	providers: [
		ChartComponent,
		StudyDialog,
		ThemeDialog,
		TimezoneDialog,
		Colorpicker,
		OverlayMenu,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartUI implements AfterViewChecked {
	@ViewChild(ChartComponent, { static: true })
	chartComponent: ChartComponent;
	@ViewChild(ThemeDialog, { static: true }) themeDialog: ThemeDialog;
	symbolInput: string;
	public chartLayout: any;
	periodicity: string;
	chartType: string;
	symbolComparison: string;

	constructor(private zone: NgZone) {
		this.periodicity = '5 min';
		this.chartType = 'candle';
	}
	ngAfterViewChecked() {
		this.chartLayout = this.getChartLayout();
	}
	changeSymbol() {
		this.chartComponent.ciq.newChart(
			this.symbolInput,
			this.chartComponent.sampleData
		);
		this.symbolInput = '';
	}
	changePeriodicity(period, interval) {
		this.chartComponent.ciq.setPeriodicityV2(period, interval);
		for (let i in this.periodicityOptions) {
			if (
				this.periodicityOptions[i].interval ==
					this.chartLayout.interval &&
				this.periodicityOptions[i].period ==
					this.chartLayout.periodicity
			) {
				this.zone.run(() => {
					this.periodicity = this.periodicityOptions[i].label;
				});
			}
		}
	}
	changeChartType(type) {
		if (
			(type.aggregationEdit &&
				this.chartComponent.ciq.layout.aggregationType != type.type) ||
			type.type == 'heikinashi'
		) {
			this.chartComponent.ciq.setChartType('candle');
			this.chartComponent.ciq.setAggregationType(type.type);
		} else {
			this.chartComponent.ciq.setChartType(type.type);
		}
		//update the ui
		this.chartType = type.label;
	}
	toggleCrosshairs() {
		let state = this.chartComponent.ciq.layout.crosshair;
		this.chartComponent.ciq.layout.crosshair = !state;
	}
	addComparison() {
		if (this.symbolComparison) {
			// Note that this color generator has a bias toward darker colors. Just needed a quick solution here.
			var getRandomColor = function() {
				let letters = '0123456789ABCDEF';
				let color = '#';
				for (var i = 0; i < 6; i++) {
					color += letters[Math.floor(Math.random() * 16)];
				}
				return color;
			};
			let newSeries = this.chartComponent.ciq.addSeries(
				this.symbolComparison,
				{
					isComparison: true,
					color: getRandomColor(),
					data: { useDefaultQuoteFeed: true },
				}
			);
			//update the comparison legend
			this.chartComponent.chartSeries.push(newSeries);
			this.symbolComparison = null;
		} else {
			console.log('Error: no symbol for comparison entered');
		}
	}
	getChartLayout() {
		return this.chartComponent.getLayout();
	}

	handleThemeSelect(theme) {
		const chart = this.chartComponent.ciq;
		if (theme.name == '+ New Theme') {
			this.themeDialog.showDialog(chart);
		} else {
			this.themeDialog.updateTheme(theme, chart);
		}
	}

	updateThemeList(params) {
		if (params.name) {
			// we aren't going to allow unnamed themes to be created
			var duplicate = false;
			for (var i = 0; i < this.themes.length; i++) {
				if (this.themes[i].name == params.name) {
					this.themes[i].settings = params.settings;
					duplicate = true;
				}
			}
			if (!duplicate)
				// if it's duplicate we are going to update that existing theme
				this.themes.splice(this.themes.length - 1, 0, params);
		} else console.error('Please name your custom theme.');
	}

	orderedStudies: any = Object.keys(CIQ.Studies.studyLibrary).sort(function(
		a,
		b
	) {
		if (a < b) {
			return -1;
		}
		if (a > b) {
			return 1;
		}
		// must be equal
		return 0;
	});

	studies: any = {
		list: Object.keys(CIQ.Studies.studyLibrary).sort(),
		selectedOption: '',
	};

	themes: any = [
		{
			name: 'Default',
			// the default theme settings
			settings: {
				chart: {
					'Axis Text': { color: 'rgba(197,199,201,1)' },
					Background: { color: 'rgba(28,42,53,1)' },
					'Grid Dividers': { color: 'rgba(37,55,70,1)' },
					'Grid Lines': { color: 'rgba(33,50,63,1)' },
				},
				chartTypes: {
					'Candle/Bar': {
						down: {
							border: 'rgba(227,70,33,1)',
							color: 'rgba(184,44,12,1)',
							wick: 'rgba(0,0,0,1)',
						},
						up: {
							border: 'rgba(184,222,168,1)',
							color: 'rgba(140,193,118,1)',
							wick: 'rgba(0,0,0,1)',
						},
					},
					Line: { color: 'rgba(0,0,0,1)' },
					Mountain: { color: 'rgba(102,202,196,0.498039)' },
				},
			},
		},
		{ name: '+ New Theme' },
	];

	periodicityOptions: Array<any> = [
		{
			period: 1,
			interval: 1,
			label: '1 Min',
		},
		{
			period: 1,
			interval: 3,
			label: '3 Min',
		},
		{
			period: 1,
			interval: 5,
			label: '5 Min',
		},
		{
			period: 1,
			interval: 10,
			label: '10 Min',
		},
		{
			period: 3,
			interval: 5,
			label: '15 Min',
		},
		{
			period: 1,
			interval: 30,
			label: '30 Min',
		},
		{
			period: 2,
			interval: 30,
			label: '1 Hour',
		},
		{
			period: 8,
			interval: 30,
			label: '4 Hour',
		},
		{
			period: 1,
			interval: 'day',
			label: '1 Day',
		},
		{
			period: 2,
			interval: 'day',
			label: '2 Day',
		},
		{
			period: 3,
			interval: 'day',
			label: '3 Day',
		},
		{
			period: 5,
			interval: 'day',
			label: '5 Day',
		},
		{
			period: 10,
			interval: 'day',
			label: '10 Day',
		},
		{
			period: 20,
			interval: 'day',
			label: '20 Day',
		},
		{
			period: 1,
			interval: 'week',
			label: '1 Wk',
		},
		{
			period: 1,
			interval: 'month',
			label: '1 Mon',
		},
	];

	chartTypes: Array<any> = [
		{
			type: 'bar',
			label: 'bar',
		},
		{
			type: 'candle',
			label: 'candle',
		},
		{
			type: 'colored_bar',
			label: 'colored bar',
		},
		{
			type: 'hollow_candle',
			label: 'hollow candle',
		},
		{
			type: 'line',
			label: 'line',
		},
		{
			type: 'mountain',
			label: 'mountain',
		},
		{
			type: 'volume_candle',
			label: 'volume candle',
		},
		{
			type: 'heikinashi',
			label: 'Heikin-Ashi',
		},
		{
			type: 'kagi',
			label: 'kagi',
			aggregationEdit: {
				title: 'Set Reversal Percentage',
				inputs: [
					{
						lookup: 'kagi',
						label: 'kagi',
					},
				],
			},
		},
		{
			type: 'linebreak',
			label: 'line break',
			aggregationEdit: {
				title: 'Set Price Lines',
				inputs: [
					{
						lookup: 'priceLines',
						label: 'price line',
					},
				],
			},
		},
		{
			type: 'renko',
			label: 'renko',
			aggregationEdit: {
				title: 'Set Range',
				inputs: [
					{
						lookup: 'renko',
						label: 'renko',
					},
				],
			},
		},
		{
			type: 'rangebars',
			label: 'range bars',
			aggregationEdit: {
				title: 'Set Range',
				inputs: [
					{
						lookup: 'range',
						label: 'range',
					},
				],
			},
		},
		{
			type: 'pandf',
			label: 'point & figure',
			aggregationEdit: {
				title: 'Set Point & Figure Parameters',
				inputs: [
					{
						lookup: 'pandf.box',
						label: 'box',
					},
					{
						lookup: 'pandf.reversal',
						label: 'reversal',
					},
				],
			},
		},
	];
}
