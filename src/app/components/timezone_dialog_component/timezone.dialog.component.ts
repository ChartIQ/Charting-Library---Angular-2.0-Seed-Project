import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { ChartService } from 'src/app/services';

@Component({
	selector: 'timezone-dialog',
	templateUrl: './timezone.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimezoneDialog implements OnInit {
	ciq: any;
	timezones: any[] = [];
	timezonesFiltered: any[] = [];
	filter = '';
	selectedZone = '';
	$showDialog: Observable<any>;

	constructor(private chartService: ChartService) {
		this.timezones = this.chartService.getTimezones();
		this.timezonesFiltered = this.timezones;
	}

	ngOnInit() {
		const thisDialogOnly = params => !params || params.dialog === 'timezone';

		this.$showDialog = this.chartService.$dialog.pipe(filter(thisDialogOnly));
	}

	setTimezone(zone = null) {
		this.selectedZone = zone;
		this.chartService.setTimezone(zone);
		this.closeMe();
	}

	setMyTimezone() {
		this.setTimezone();
		this.selectedZone = '';
	}

	closeMe() {
		setTimeout(() => this.chartService.hideDialog(), 800);
	}

	onFilter(value) {
		const re = RegExp(value, 'i');
		this.timezonesFiltered = this.timezones.filter(el => !value || re.test(el));
	}
}
