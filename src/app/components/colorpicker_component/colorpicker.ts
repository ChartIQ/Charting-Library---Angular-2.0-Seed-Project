import { Component, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'colorpicker',
	templateUrl: './colorpicker.html',
})
export class Colorpicker {
	posLeft: any = 0;
	posTop: any = 0;
	caller: any = false;
	parent: any = false;
	launch: any = false;
	@Output() setThemeSwatchColor: EventEmitter<any> = new EventEmitter();
	@Output() setStudySwatchColor: EventEmitter<any> = new EventEmitter();
	@Output() setDrawingSwatchColor: EventEmitter<any> = new EventEmitter();

	constructor(public element: ElementRef) {}

	setColor = function(params) {
		var that = this;
		return function() {
			if (
				that.parent == 'output' ||
				that.parent == 'input' ||
				that.parent == 'parameter'
			)
				that.setStudySwatchColor.emit({
					color: arguments[0],
					source: that.caller,
					params: params,
				});
			else if (that.parent == 'drawingParameters')
				that.setDrawingSwatchColor.emit({
					color: arguments[0],
					source: that.caller,
					params: params,
				});
			else
				that.setThemeSwatchColor.emit({
					color: arguments[0],
					source: that.caller,
					params: params,
				});
			that.closeMe();
		};
	};

	closeMe = function() {
		this.launch = false;
		this.posLeft = 0;
		this.posTop = 0;
	};

	launchColorpicker(params) {
		this.createColorPicker(
			this.element.nativeElement.children.colorPicker.children[0],
			this.setColor(params.setting)
		);
		var clicked = params.swatch;
		this.posLeft = clicked.offsetLeft + 'px';
		this.posTop = clicked.offsetHeight + 'px';
		this.caller = clicked;
		this.parent = clicked.parentNode.classList[0];
		this.launch = true;
	}

	private colorPickerColors: string[] = [
		'ffffff',
		'ffd0cf',
		'ffd9bb',
		'fff56c',
		'eaeba3',
		'd3e8ae',
		'adf3ec',
		'ccdcfa',
		'd9c3eb',
		'efefef',
		'eb8b87',
		'ffb679',
		'ffe252',
		'e2e485',
		'c5e093',
		'9de3df',
		'b1c9f8',
		'c5a6e1',
		'cccccc',
		'e36460',
		'ff9250',
		'ffcd2b',
		'dcdf67',
		'b3d987',
		'66cac4',
		'97b8f7',
		'b387d7',
		'9b9b9b',
		'dd3e39',
		'ff6a23',
		'faaf3a',
		'c9d641',
		'8bc176',
		'33b9b0',
		'7da6f5',
		'9f6ace',
		'656565',
		'b82c0b',
		'be501b',
		'e99b54',
		'97a030',
		'699158',
		'00a99d',
		'5f7cb8',
		'784f9a',
		'343434',
		'892008',
		'803512',
		'ab611f',
		'646c20',
		'46603a',
		'007e76',
		'3e527a',
		'503567',
		'000000',
		'5c1506',
		'401a08',
		'714114',
		'333610',
		'222f1d',
		'00544f',
		'1f2a3c',
		'281a33',
	];

	private createColorPicker(div, fc) {
		div.innerHTML = '';
		var ul = document.createElement('ul');
		ul.style.margin = '0';
		ul.style.padding = '0';
		ul.style.listStyleType = 'none';
		ul.style.zoom = '1';
		div.appendChild(ul);
		function clkFn(c) {
			return function() {
				fc(c);
				return false;
			};
		}
		for (const currentColor of this.colorPickerColors) {
			var li = document.createElement('li');
			var a = document.createElement('a');
			li.appendChild(a);
			li.style.cssFloat = 'left';
			li.style.margin = '0 5px 5px 0';
			a.href = '#';
			a.title = currentColor;
			a.style.background = '#' + currentColor;
			a.innerHTML = currentColor;
			a.style.display = 'block';
			a.style.width = '13px';
			a.style.height = '13px';
			a.style.textDecoration = 'none';
			a.style.textIndent = '-100000px';
			a.style.outline = '0';
			a.style.border = '1px solid #aaa';
			ul.appendChild(li);
			a.onclick = clkFn(currentColor);
		}
	}
}
