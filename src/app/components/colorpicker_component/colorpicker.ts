import {
	Component,
	ElementRef,
	OnInit,
	ChangeDetectionStrategy,
} from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ChartService, ConfigService } from '../../services';

@Component({
	selector: 'ciq-colorpicker',
	templateUrl: './colorpicker.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Colorpicker implements OnInit {
	cb: any;
	$style: Observable<any>;
	on: any;

	constructor(
		public element: ElementRef,
		private chartService: ChartService,
		public config: ConfigService
	) {}

	ngOnInit() {
		this.createColorPicker();
		this.$style = this.chartService.$color.pipe(
			map(({ swatch, cb }: any = {}) => {
				this.on = swatch && +new Date();
				if (!swatch) {
					return { display: 'none' };
				}
				this.cb = cb;

				return { ...getLocation(swatch), display: 'block' };
			})
		);
	}

	private createColorPicker() {
		const container = this.element.nativeElement.querySelector(
			'.color-picker-options'
		);
		container.innerHTML = '';
		var ul = document.createElement('ul');

		ul.innerHTML = this.config.colorPickerColors
			.map(
				color => `
					<li>
						<a href="javascript: ;" 
							style="background: #${color}";
							title="${color}"
						></a>
					</li>`
			)
			.join('\n');

		ul.addEventListener('click', event => {
			event.stopPropagation();
			const color = event.target['title'];
			if (this.cb && color) {
				this.cb('#' + color);
				this.chartService.hideColorPicker();
			}
		});
		container.appendChild(ul);

		// close color-picker if clicked away from it
		document.addEventListener('click', event => {
			// ignore opening click
			if (+new Date() - this.on > 500) {
				this.chartService.hideColorPicker();
			}
		});
	}
}

function getLocation(el) {
	const { top, left } = el.getBoundingClientRect();
	return {
		left: left + 'px',
		top: top + 'px',
	};
}
