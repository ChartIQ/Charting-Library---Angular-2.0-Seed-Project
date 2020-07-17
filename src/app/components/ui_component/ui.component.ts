import {
	Component,
	ViewChild,
	OnInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	ElementRef,
	HostListener,
	OnDestroy,
	HostBinding,
} from '@angular/core';

import { Observable, Unsubscribable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { ChartComponent } from '../chart_component/chart.component';
import { ThemeDialog } from '../theme_dialog_component/theme.dialog.component';
import { DrawingToolbar } from '../drawing_toolbar_component/drawing.toolbar.component';
import { ChartService, ConfigService } from '../../services';

@Component({
	selector: 'chart-ui',
	templateUrl: './ui.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [ChartService],
})
export class ChartUI implements OnInit, OnDestroy {
	@ViewChild(ChartComponent, { static: true }) chartComponent: ChartComponent;
	@ViewChild(ThemeDialog, { static: true }) themeDialog: ThemeDialog;
	@ViewChild(DrawingToolbar, { static: true }) drawingToolbar: DrawingToolbar;
	symbolInput: string;
	periodicity: string;
	chartType: string;
	symbolComparison: string;
	footerSpanSizes: Array<{ label: string; span: number; unit: string }> = [];
	showDrawing = false;

	$crosshair: Observable<boolean>;
	$themes: Observable<any[]>;
	$layout: Observable<any>;
	$toolbarActive: Observable<boolean>;
	$sizeInfo: Observable<any>;
	$tfc: Observable<any>;

	unsubscribe: Unsubscribable;

	@HostBinding('class.break-lg') breakLg = true;
	@HostBinding('class.break-md') breakMd = false;
	@HostBinding('class.break-sm') breakSm = false;

	constructor(
		public chartService: ChartService,
		public config: ConfigService,
		private el: ElementRef,
		private cd: ChangeDetectorRef
	) {
		this.periodicity = '1 day';
		this.chartType = 'candle';
		this.chartService.contextContainer = el.nativeElement;
	}

	ngOnInit() {
		this.$crosshair = this.chartService.$chrosshair;
		this.$themes = this.chartService.$themes;
		this.$toolbarActive = this.chartService.$toolbarActive;
		this.$tfc = this.chartService.$tfc;
		this.unsubscribe = this.chartService.$sizeInfo.subscribe(
			({ width, height, size }) => {
				this.breakLg = size === 'lg';
				this.breakMd = size === 'md';
				this.breakSm = size === 'sm';
			}
		);
		this.notifyResize();
		this.chartService.$layout
			.pipe(
				map(data => {
					if (!data) return;
					const { periodicity, interval, timeUnit } = data.layout;
					const selection = this.periodicityObjToLabel({
						periodicity,
						interval,
						timeUnit,
					});

					this.periodicity = selection ? selection.label : '';
					this.cd.markForCheck();
				})
			)
			.subscribe();
	}

	@HostListener('window:resize', ['$event'])
	notifyResize(ev = null) {
		this.chartService.containerResized(this.el.nativeElement);
	}

	changeSymbol() {
		this.chartService.changeSymbol(null, this.symbolInput);
		this.symbolInput = '';
	}

	changePeriodicity(newPeriodicity) {
		this.chartService.setPeriodicity(newPeriodicity);
	}

	changeChartType(type) {
		this.chartService.changeChartType(type);
		this.chartType = type.label;
	}

	toggleCrosshairs() {
		this.chartService.toggleCrosshair();
	}

	toggleDrawingToolbar() {
		this.showDrawing = this.drawingToolbar.toggleDrawingToolbar();
		this.chartService.toggleToolbar();
	}

	toggleTFC() {
		this.chartService.toggleTFC();
	}

	showTimezoneDialog() {
		this.chartService.showDialog('timezone');
	}

	addComparison() {
		if (this.symbolComparison) {
			this.chartService.addSeries(this.symbolComparison);
			this.symbolComparison = null;
		} else {
			console.log('Error: no symbol for comparison entered');
		}
	}

	addStudy(study) {
		this.chartService.addStudy(study);
	}

	setSpan(multiplier, span) {
		this.chartService.setSpan(multiplier, span);
	}

	getChart() {
		return this.chartService.ciq;
	}

	periodicityObjToLabel(obj) {
		const p = obj.periodicity;
		const i = typeof obj.interval === 'number' ? obj.interval : 1;
		const tU = obj.timeUnit ? obj.timeUnit : obj.interval;

		const selection = Object.values(this.config.periodicityOptions).find(
			({ period, interval, timeUnit }) =>
				p === period && i === interval && tU === timeUnit
		);
		return selection;
	}

	handleThemeSelect(theme) {
		this.chartService.setTheme(
			theme.name === '+ New Theme' ? undefined : theme
		);
	}

	ngOnDestroy() {
		this.unsubscribe.unsubscribe();
	}

	studiesList: string[] = this.chartService.getLibraryStudyNames();
}
