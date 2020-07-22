import { Injectable, Optional } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';

import { CIQ } from 'chartiq/js/advanced.js';

import quoteFeedSimulator from 'chartiq/examples/feeds/quoteFeedSimulator';

import { ConfigService } from './config.service';
import { ITfc } from '../plugins/tfc.interface';

import 'chartiq/examples/markets/marketDefinitionsSample'
import 'chartiq/examples/markets/marketSymbologySample'

@Injectable()
export class ChartService {
	ciq: any;
	layout: any;
	contextContainer: HTMLElement;

	themes = this.config.themes;

	$chartSeries = new BehaviorSubject([]);
	$chrosshair = new BehaviorSubject(false);

	$layout = new BehaviorSubject<any>(null);
	$contexMenu = new BehaviorSubject<any>(null);
	$dialog = new BehaviorSubject<any>(null);
	$color = new BehaviorSubject<any>(undefined);
	$themes = new BehaviorSubject<any>({ selected: 'Default', themes: [] });
	$toolbarActive = new BehaviorSubject<boolean>(false);
	$sizeInfo = new ReplaySubject<any>();

	// plugins
	tfcInit = false;
	tfcOpen = false;
	$tfc = new BehaviorSubject<any>(undefined);

	constructor(
		private config: ConfigService,
		@Optional() private tfcService: ITfc
	) {
		// To implement your own quotefeed and see other methods of data loading, check out our tutorial: http://documentation.chartiq.com/tutorial-Data%20Loading.html
		// CIQ.QuoteFeed.MyFeed = function(url) {
		// 	this.url = url;
		// };
		// // Inherit from the base feed
		// CIQ.QuoteFeed.MyFeed.ciqInheritsFrom(CIQ.QuoteFeed);
		if (tfcService && tfcService.available()) {
			this.$tfc.next({ available: true });
		}
		this.$themes.next(this.themes);

		if (this.config.showTooltip) {
			this.addTooltip();
		}
	}

	createChart(
		container: HTMLElement,
		{
			symbol = 'APPL',
			periodicity = 1,
			interval = 1,
			timeUnit = 'day',
			refreshInterval = 0,
		} = {}
	) {
		const ciq = new CIQ.ChartEngine({
			container,
			layout: { periodicity, interval, timeUnit },
		});

		ciq.setMarketFactory(CIQ.Market.Symbology.factory);
		ciq.attachQuoteFeed(quoteFeedSimulator, { refreshInterval });

		if (symbol) {
			ciq.loadChart(symbol);
		}

		// attach to window for debugging purposes
		window['stxx'] = ciq;
		window['toggleRangeSlider'] = this.toggleRangeSlider.bind(this);

		// add event listeners
		ciq.addEventListener('studyOverlayEdit', params => this.openContext(params));
		ciq.addEventListener('layout', params => this.$layout.next(params));

		this.$layout
			.pipe(
				filter(data => !!data),
				map(data => Object.values(data.stx.chart.series)),
			)
			.subscribe(this.$chartSeries);

		this.ciq = ciq;
		return ciq;
	}

	addTooltip() {
		import('chartiq/js/addOns').then(() => {
			new CIQ.Tooltip({ stx: this.ciq, ohl: true });
		});
	}

	openContext(params) {
		this.$contexMenu.next(params);
	}

	closeContext() {
		this.$contexMenu.next(null);
	}

	setPeriodicity({ period, interval, timeUnit }) {
		this.ciq.setPeriodicity({ period, timeUnit, interval });
	}

	setSpan(multiplier, span) {
		this.ciq.setSpan({ multiplier, span });
	}

	changeSymbol(symbol) {
		this.ciq.loadChart(symbol);
	}

	addSeries(seriesName) {
		const series = this.ciq.addSeries(seriesName, {
			isComparison: true,
			color: getRandomColor(),
			data: { useDefaultQuoteFeed: true },
		});
	}

	removeSeries(series) {
		this.ciq.removeSeries(series.display, this.ciq.ciq);
	}

	changeChartType(type) {
		const { ciq } = this;
		if (
			(type.aggregationEdit && ciq.layout.aggregationType != type.type) ||
			type.type == 'heikinashi'
		) {
			ciq.setChartType('candle');
			ciq.setAggregationType(type.type);
		} else {
			ciq.setChartType(type.type);
		}
	}

	toggleCrosshair(value = null) {
		const { layout } = this.ciq;
		layout.crosshair = value !== null ? value : !layout.crosshair;
		this.$chrosshair.next(layout.crosshair);
	}

	// If value is provided the function works as set method
	toggleRangeSlider(value) {
		const { ciq: stx } = this;
		if (typeof value === 'undefined') {
			value = !stx.layout.rangeSlider;
		}
		stx.layout.rangeSlider = value;
	
		import('chartiq/js/addOns').then(() => {
			if (!stx.slider) new CIQ.RangeSlider({ stx });
			stx.slider.display(stx.layout.rangeSlider ? 1 : 0);
		});
	}

	getLibraryStudyNames() {
		return Object.keys(CIQ.Studies.studyLibrary).sort();
	}

	addStudy(study) {
		CIQ.Studies.addStudy(this.ciq, study);
	}

	removeStudy(study) {
		CIQ.Studies.removeStudy(this.ciq, study);
	}

	getStudyDialogHelper(sd) {
		return new CIQ.Studies.DialogHelper({ sd, stx: this.ciq });
	}

	showDialog(dialog, params = {}) {
		this.$dialog.next({ dialog, ...params, stx: this.ciq });
	}

	hideDialog() {
		this.$dialog.next(null);
	}

	showColorPicker(swatch, cb) {
		this.$color.next({ swatch, cb });
	}

	hideColorPicker() {
		this.$color.next(undefined);
	}

	toggleToolbar(active = undefined) {
		const value = active !== undefined ? active : !this.$toolbarActive.value;
		this.$toolbarActive.next(value);

		// force chart resizing as toolbar gets animated for smoother transition
		let start = null;
		const doResize = (timestamp = 0) => {
			this.ciq.resizeChart();
			start = start || timestamp;
			if (timestamp - start < 400) {
				requestAnimationFrame(doResize);
			}
		};

		doResize();
	}

	getDrawingParameters(tool) {
		return CIQ.Drawing.getDrawingParameters(this.ciq, tool);
	}

	getDrawingToolList() {
		const list = CIQ.Drawing.getDrawingToolList({});
		return Object.keys(list).sort();
	}

	setDrawingTool(tool = '') {
		this.ciq.changeVectorType(tool);
	}

	setDrawingParameter(parameter, value) {
		this.ciq.changeVectorParameter(parameter, value);
	}

	setDrawingFontFromStyle(styleName = 'stx_annotation') {
		const {
			fontSize,
			fontFamily,
			fontStyle,
			fontWeight,
		} = this.ciq.canvasStyle(styleName);

		const { font } = this.ciq.currentVectorParameters.annotation;

		font.size = fontSize;
		font.family = fontFamily;
		font.style = fontStyle;
		font.weight = fontWeight;

		return {
			fontSize,
			fontFamily,
			fontStyle,
			fontWeight,
		};
	}

	getThemeHelper() {
		return new CIQ.ThemeHelper({ stx: this.ciq });
	}

	setTheme(theme = null) {
		if (!theme) {
			this.showDialog('theme');
			return;
		}

		this.applyThemeSettings(theme.settings);

		this.themes.selected = theme.name;
		this.$themes.next(this.themes);
	}

	saveTheme(name, themeHelper) {
		if (!name) {
			CIQ.alert('Please name your theme');
			return;
		}

		const newTheme = {
			name,
			settings: CIQ.clone(themeHelper.settings),
		};

		// update existing name theme
		const { list } = this.themes;
		const theme = list.find(theme => theme.name === name);
		if (theme) {
			theme.settings = newTheme.settings;
		} else {
			// if name is new insert the theme before the last item - "New Theme"
			list.splice(list.length - 1, 0, newTheme);
		}
		this.setTheme(newTheme);
		return true;
	}

	getThemeSettings() {
		return CIQ.clone(this.getThemeHelper().settings);
	}

	applyThemeSettings(settings) {
		const themeHelper = this.getThemeHelper();

		themeHelper.settings = settings;
		themeHelper.update();
	}

	getTimezones() {
		return Object.values(CIQ.timeZoneMap).sort();
	}

	setTimezone(zone = null) {
		this.ciq.setTimeZone(this.ciq.dataZone, zone);

		if (zone === null) {
			this.ciq.defaultDisplayTimeZone = null;

			CIQ.ChartEngine.registeredContainers.forEach(({ stx }) => {
				stx.displayZone = null;
				stx.setTimeZone();

				if (stx.displayInitialized) stx.draw();
			});
		}

		if (this.ciq.chart.symbol) {
			this.ciq.draw();
		}
	}

	containerResized(el: HTMLElement) {
		const { width, height } = el.getBoundingClientRect();

		const sizeToObj = (width, height) => {
			const size = width > 700 ? 0 : width > 584 ? 1 : 2;

			return {
				width,
				height,
				size: ['lg', 'md', 'sm'][size],
				symbolPlaceholder: ['Enter Symbol', 'Symbol', ''][size],
			};
		};

		this.$sizeInfo.next(sizeToObj(width, height));
	}

	toggleTFC(value = null) {
		if (!this.tfcService) {
			return;
		}
		const {
			ciq,
			contextContainer,
			tfcService: { loadPlugin, openPanel },
		} = this;

		this.tfcOpen = value === null ? !this.tfcOpen : value;
		openPanel(contextContainer, this.tfcOpen);

		if (!this.tfcInit) {
			this.tfcInit = true;
			const context = {
				changeSymbol: symbol => this.changeSymbol(symbol),
				topNode: contextContainer
			};

			loadPlugin({
				stx: ciq,
				context,
			}).then(() => {
				contextContainer.querySelector('.tfc-load-info').remove();
				openPanel(contextContainer, this.tfcOpen);
			});
		}
	}

	destroyChart() {
		// This will remove the quoteDriver, styles and
		// eventListeners for this ChartEngine instance.
		this.ciq.destroy();
	}

	getLayout() {
		return this.ciq.layout;
	}

	hexToRgba(color) {
		CIQ.hexToRgba('#' + color);
	}
}

function getRandomColor() {
	// Note that this color generator has a bias toward darker colors.
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
