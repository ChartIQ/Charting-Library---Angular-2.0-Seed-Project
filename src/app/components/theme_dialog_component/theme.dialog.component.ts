import {
	Component,
	Output,
	EventEmitter,
	ChangeDetectionStrategy,
	OnInit,
} from '@angular/core';

import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { ChartService } from '../../services';

@Component({
	selector: 'theme-dialog',
	templateUrl: './theme.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeDialog implements OnInit {
	themeHelper: any = {};
	themeName: string;
	candleUp: any;
	candleDown: any;
	lineBarChart: any;
	mountainChart: any;
	axis: any;
	background: any;
	gridDividers: any;
	gridLines: any;
	$showDialog: Observable<any>;
	@Output() themeToPush = new EventEmitter<any>();

	constructor(private chartService: ChartService) {}

	ngOnInit() {
		const thisDialogOnly = params => !params || params.dialog === 'theme';

		this.$showDialog = this.chartService.$dialog.pipe(
			filter(thisDialogOnly),
			tap(params => params && this.showDialog())
		);
	}

	// updateTheme(theme) {
	// 	// if (theme.name == 'Default') {
	// 	// 	this.themeHelper = this.chartService.getThemeHelper();
	// 	// }
	// 	// this.themeHelper.settings = theme.settings;
	// 	// this.themeHelper.update();
	// }

	showDialog = function() {
		this.themeHelper = this.chartService.getThemeHelper();
		this.initSettings = this.chartService.getThemeSettings();

		const { chartTypes, chart } = this.themeHelper.settings;
		const { up, down } = chartTypes['Candle/Bar'];

		this.candleUp = up;
		this.candleDown = down;
		this.lineBarChart = chartTypes['Line'];
		this.mountainChart = chartTypes['Mountain'];
		this.axis = chart['Axis Text'];
		this.background = chart['Background'];
		this.gridDividers = chart['Grid Dividers'];
		this.gridLines = chart['Grid Lines'];
	};

	launchColorpicker(setting, { target: swatch }) {
		this.chartService.showColorPicker(swatch, color => {
			swatch.style.backgroundColor = color;
			this.updateThemeHelper(color, setting);
		});
	}

	updateThemeHelper = function(color, themeDetail) {
		const colorStr = color;
		const { chartTypes, chart } = this.themeHelper.settings;
		switch (themeDetail) {
			case 'candleUp':
				chartTypes['Candle/Bar'].up.color = colorStr;
				break;
			case 'candleDown':
				chartTypes['Candle/Bar'].down.color = colorStr;
				break;
			case 'wickUp':
				chartTypes['Candle/Bar'].up.wick = colorStr;
				break;
			case 'wickDown':
				chartTypes['Candle/Bar'].down.wick = colorStr;
				break;
			case 'borderUp':
				chartTypes['Candle/Bar'].up.border = colorStr;
				break;
			case 'borderDown':
				chartTypes['Candle/Bar'].down.border = colorStr;
				break;
			case 'lineBar':
				chartTypes['Line'].color = colorStr;
				break;
			case 'mountain':
				chartTypes['Mountain'].color = colorStr;
				break;
			case 'chartBackground':
				chart['Background'].color = colorStr;
				break;
			case 'dividers':
				chart['Grid Dividers'].color = colorStr;
				break;
			case 'lines':
				chart['Grid Lines'].color = colorStr;
				break;
			case 'axis':
				chart['Axis Text'].color = colorStr;
				break;
		}

		this.themeHelper.update();
	};

	closeMe = function(saveTheme = false) {
		if (saveTheme) {
			const saved = this.chartService.saveTheme(
				this.themeName,
				this.themeHelper
			);
			if (!saved) {
				return;
			}
		} else {
			this.chartService.applyThemeSettings(this.initSettings);
		}
		this.chartService.hideDialog();
	};
}
