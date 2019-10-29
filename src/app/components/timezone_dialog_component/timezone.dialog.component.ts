import { Component, Output, EventEmitter } from '@angular/core';

import { CIQ } from 'chartiq';

@Component({
	selector: 'timezone-dialog',
	templateUrl: './timezone.dialog.component.html',
})
export class TimezoneDialog {
	ciq: any;
	timezones: any[] = [];
	timezonesFiltered: any[] = [];
	filter = '';
	myZone: any;
	@Output() launchDialog = new EventEmitter<any>();

	constructor() {
		this.timezones = Object.values(CIQ.timeZoneMap).sort();
		this.timezonesFiltered = this.timezones;
		this.myZone = true; //default behavior
	}

	launchTimezoneDialog(chart) {
		this.ciq = chart;
		this.launchDialog.emit(true);
	}

	setTimezone(zone) {
		this.ciq.setTimeZone(this.ciq.dataZone, zone);
		this.myZone = false;
		if (this.ciq.chart.symbol) this.ciq.draw();
		this.launchDialog.emit(false);
	}

	setMyTimezone() {
		this.ciq.defaultDisplayTimeZone = null;
		for (var i = 0; i < CIQ.ChartEngine.registeredContainers.length; i++) {
			var stx = CIQ.ChartEngine.registeredContainers[i].stx;
			stx.displayZone = null;
			this.myZone = true;
			stx.setTimeZone();

			if (stx.displayInitialized) stx.draw();
		}
		if (this.ciq.chart.symbol) this.ciq.draw();
		this.closeMe();
	}

	closeMe = function() {
		this.launchDialog.emit(false);
	};

	onFilter(value) {
		const re = RegExp(value, 'i');
		this.timezonesFiltered = this.timezones.filter(
			el => !value || re.test(el)
		);
	}
}
