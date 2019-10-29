import {
	Component,
	ViewChild,
	AfterViewChecked,
	ChangeDetectionStrategy,
	NgZone,
} from '@angular/core';

import {
	ChartComponent,
	ThemeDialog,
	DrawingToolbar,
	StudyDialog,
	TimezoneDialog,
	Colorpicker,
	OverlayMenu,
} from '../';

import { CIQ } from 'chartiq';
import { interval } from 'rxjs';

@Component({
	selector: 'chart-ui',
	templateUrl: './ui.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartUI implements AfterViewChecked {
	@ViewChild(ChartComponent, { static: true }) chartComponent: ChartComponent;
	@ViewChild(ThemeDialog, { static: true }) themeDialog: ThemeDialog;
	@ViewChild(DrawingToolbar, { static: true }) drawingToolbar: DrawingToolbar;
	symbolInput: string;
	public chartLayout: any;
	periodicity: string;
	chartType: string;
	symbolComparison: string;
	showCrosshair = false;
	showDrawing = false;

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
		);
		this.symbolInput = '';
	}

	changePeriodicity(period: number, unit: string | number) {
		const timeUnit = typeof unit === 'number' ? 'minute' : unit;
		const interval = typeof unit === 'number' ? unit : 1;
		this.chartComponent.ciq.setPeriodicity({ period, timeUnit, interval });

		const selection = Object.values(this.periodicityOptions).find(({ period: p, interval: i}) => {
			return period === p && unit === i;
		});
		if (selection) {
			this.periodicity = selection.label;
		}
	}

	changeChartType(type) {
		const ciq = this.getChart();
		if (
			(type.aggregationEdit &&
				ciq.layout.aggregationType != type.type) ||
			type.type == 'heikinashi'
		) {
			ciq.setChartType('candle');
			ciq.setAggregationType(type.type);
		} else {
			ciq.setChartType(type.type);
		}
		//update the ui
		this.chartType = type.label;
	}

	toggleCrosshairs() {
		const layout = this.getChartLayout();
		layout.crosshair = !layout.crosshair;
		this.showCrosshair = layout.crosshair;
	}

	toggleDrawingToolbar() {
		console.log(this.drawingToolbar)
		this.showDrawing = this.drawingToolbar.toggleDrawingToolbar(this.getChart());
	}

	addComparison() {
		if (this.symbolComparison) {
			const newSeries = this.chartComponent.ciq.addSeries(this.symbolComparison, {
				isComparison: true,
				color: getRandomColor(),
				data: { useDefaultQuoteFeed: true },
			});
			// update the comparison legend
			this.chartComponent.addSeries(newSeries);
			this.symbolComparison = null;
		} else {
			console.log('Error: no symbol for comparison entered');
		}

		function getRandomColor() {
			// Note that this color generator has a bias toward darker colors. 
			const letters = '0123456789ABCDEF';
			let color = '#';
			for (var i = 0; i < 6; i++) {
				color += letters[Math.floor(Math.random() * 16)];
			}
			return color;
		};
	}

	getChart() {
		return this.chartComponent.ciq;
	}
	getChartLayout() {
		return this.chartComponent.getLayout();
	}

	handleThemeSelect(theme) {
		const chart = this.getChart();
		if (theme.name === '+ New Theme') {
			this.themeDialog.showDialog(chart);
		} else {
			this.themeDialog.updateTheme(theme, chart);
		}
	}

	updateThemeList(params) {
		if (params.name) {
			// do not allow unnamed themes to be created
			let duplicate = false;
			// update existing name theme
			for (let theme of this.themes) {
				if (theme.name === params.name) {
					theme.settings = params.settings;
					duplicate = true;
				}
			}
			if (!duplicate) {
				// if it's not duplicate insert the theme before the last item - "New Theme"
				this.themes.splice(this.themes.length - 1, 0, params);
			}
		} else console.error('Please name your custom theme.');
	}

	orderedStudies: any = Object.keys(CIQ.Studies.studyLibrary).sort();

	studies: any = {
		list: Object.keys(CIQ.Studies.studyLibrary).sort(),
		selectedOption: '',
	};

	themes: any = [
		{
			// the default theme settings
			name: 'Default',
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

	periodicityOptions: Array<{ period: number, interval: number | string, label: string }> = [
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
