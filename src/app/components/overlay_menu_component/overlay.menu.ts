import { Component, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'overlay-menu',
	templateUrl: './overlay.menu.html',
})
export class OverlayMenu {
	style: any;
	stx: any;
	sd: any;
	launchMenu: any = false;
	@Output() launchStudyDialog: EventEmitter<any> = new EventEmitter();
	@Output() removeStudy: EventEmitter<any> = new EventEmitter();

	constructor(public element: ElementRef) {}

	closeMe() {
		this.launchMenu = null;
	}

	launchMe = function({ sd, ciq: stx, ciq: { cx, cy } }) {
		this.launchMenu = true;
		this.style = { top: cy + 'px', left: cx + 'px' };
		this.stx = stx;
		this.sd = sd;
	};

	clickHandler(event) {
		const { stx, sd } = this;
		if (event == 'edit') {
			this.launchStudyDialog.emit({ sd, stx });
		} else {
			this.removeStudy.emit({ sd, stx });
		}
		this.closeMe();
	}
}
