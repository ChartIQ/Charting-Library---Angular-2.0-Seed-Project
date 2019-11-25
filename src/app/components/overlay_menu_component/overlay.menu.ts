import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ChartService } from 'src/app/services';

@Component({
	selector: 'overlay-menu',
	templateUrl: './overlay.menu.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayMenu implements OnInit {
	sd: any;
	$showMenu: Observable<any>;

	constructor(private chartSevice: ChartService) {}

	ngOnInit() {
		this.$showMenu = this.chartSevice.$contexMenu.pipe(
			map(params => this.positionToStyle(params))
		);
	}

	positionToStyle(params) {
		if (!params) {
			return null;
		}

		this.sd = params.sd;

		return {
			left: params.stx.cx + 'px',
			top: params.stx.cy + 'px',
		};
	}

	closeMe() {
		this.chartSevice.closeContext();
	}

	clickHandler(event) {
		const { sd } = this;
		if (event == 'edit') {
			this.chartSevice.showDialog('study', { sd });
		} else {
			this.chartSevice.removeStudy(sd);
		}
		this.closeMe();
	}
}
