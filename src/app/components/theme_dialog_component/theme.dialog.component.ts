import { Component, Output, EventEmitter } from '@angular/core';

import { CIQ } from 'chartiq';

@Component({
	selector: 'theme-dialog',
	templateUrl: './theme.dialog.component.html',
})
export class ThemeDialog {
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
	@Output() themeToPush = new EventEmitter<any>();
	@Output() launchDialog = new EventEmitter<any>();
	@Output() launchColorpickerEvent = new EventEmitter<any>();

	updateTheme(theme, chart) {
		if (theme.name == 'Default') {
			this.themeHelper = new CIQ.ThemeHelper({ stx: chart });
		}
		this.themeHelper.settings = theme.settings;
		this.themeHelper.update();
	}

	updateThemeHelper = function(color, themeDetail) {
		const colorStr = CIQ.hexToRgba('#' + color);
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
	};

	showDialog = function(stx) {
		this.themeHelper = new CIQ.ThemeHelper({ stx });
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
		this.launchDialog.emit(true);
	};

	launchColorpicker(setting, { target: swatch }) {
		this.launchColorpickerEvent.emit({
			swatch,
			setting,
		});
	}

	setColorFromPicker({ color, source, params }) {
		this.updateThemeHelper(color, params);
		source.style.backgroundColor = CIQ.hexToRgba('#' + color);
	}

	closeMe = function(saveTheme = false) {
		if (saveTheme) {
			var clone = CIQ.clone(this.themeHelper.settings);
			var newTheme = { name: this.themeName, settings: clone };
			this.themeToPush.emit(newTheme);
			this.updateTheme(newTheme);
		}
		this.launchDialog.emit(false);
	};
}
