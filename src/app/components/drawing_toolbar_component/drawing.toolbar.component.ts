import { Component, Output, EventEmitter, Input } from '@angular/core';

import { CIQ } from 'chartiq';
import { TitlecasePipe } from '../../pipes/title.case.pipe';
import { ChartComponent } from '../chart_component/chart.component';

@Component({
	selector: 'drawing-toolbar',
	templateUrl: './drawing.toolbar.component.html',
	providers: [TitlecasePipe],
})
export class DrawingToolbar {
	ciq: any;
	activeOutput: any = {};
	drawingToolsMap: any;
	drawingTools: any = [];
	open: boolean = false;
	selectedTool: any;
	toolParams: any;
	fillColor: any;
	lineColor: any;
	lineWidth: any;
	pattern: any;
	selectedLineClass: any;
	fontSize: any = 13;
	fontFamily: any = 'Helvetica'; //defaults
	fontSizeOptions: any = [8, 10, 12, 13, 14, 16, 20, 28, 36, 48, 64];
	fontFamilyOptions: any = [
		'Helvetica',
		'Courier',
		'Garamond',
		'Palatino',
		'Times New Roman',
	];
	bold: boolean = false;
	italic: boolean = false;
	showFontOptions: boolean = false;
	@Input() chartContainer: ChartComponent;
	@Output() launchToolbar = new EventEmitter<any>();
	@Output() launchColorpickerEvent = new EventEmitter<any>();

	constructor() {
		this.drawingToolsMap = CIQ.Drawing.getDrawingToolList({});
		//sort the tools
		for (let i in this.drawingToolsMap) {
			this.drawingTools.push(this.drawingToolsMap[i]);
		}
		this.drawingTools.sort(function(a, b) {
			if (a < b) {
				return -1;
			}
			if (a > b) {
				return 1;
			}
			// must be equal
			return 0;
		});
	}

	toggleDrawingToolbar(chart) {
		if (chart) this.ciq = chart;
		this.launchToolbar.emit(!this.open);
		this.open = !this.open;
		if (!this.open) {
			this.selectedTool = false;
			this.toolParams = false;
			this.fillColor = false;
			this.lineColor = false;
			this.lineWidth = false;
			this.pattern = false;
			this.ciq.changeVectorType('');
		}
		this.chartContainer.setToolbar(this.open);
		this.ciq.draw();
		return this.open;
	}

	setTool(tool) {
		// Set all the info for the toolbar
		this.selectedTool = TitlecasePipe.prototype.transform(tool);
		this.toolParams = CIQ.Drawing.getDrawingParameters(this.ciq, tool);

		if (tool == 'callout' || tool == 'annotation') {
			// no need to do this every time
			// Sync the defaults for font tool
			const style = this.ciq.canvasStyle('stx_annotation');

			const size = style.fontSize;
			this.ciq.currentVectorParameters.annotation.font.size = size;
			this.fontSize = size;
			this.ciq.currentVectorParameters.annotation.font.family =
				style.fontFamily;
			this.fontFamily = style.fontFamily;
			this.ciq.currentVectorParameters.annotation.font.style =
				style.fontStyle;
			this.ciq.currentVectorParameters.annotation.font.weight =
				style.fontWeight;

			this.showFontOptions = true;
		} else {
			this.showFontOptions = false;
		}
		this.fillColor = this.toolParams.fillColor;
		if (this.toolParams.color == 'auto') this.lineColor = 'white';
		else this.lineColor = this.toolParams.color;
		this.lineWidth = this.toolParams.lineWidth;
		this.pattern = this.toolParams.pattern;
		if (this.lineWidth && this.pattern)
			this.selectedLineClass =
				'ciq-' + this.pattern + '-' + this.lineWidth;
		// Activate the tool
		this.ciq.changeVectorType(tool);
	}

	launchColorpicker = function(setting, event) {
		this.activeOutput['div'] = event.target;
		this.launchColorpickerEvent.emit({
			swatch: event.target,
			setting: setting,
		});
	};

	setColorFromPicker(params) {
		if (this.activeOutput.div == params.source) {
			this.updateToolColors(params.color, params.params);
			this.activeOutput.div.style.backgroundColor = CIQ.hexToRgba(
				'#' + params.color
			);
		}
	}

	updateToolColors = function(color, settings) {
		if (settings == 'drawingFill') {
			this.ciq.changeVectorParameter('fillColor', '#' + color);
		} else if (settings == 'drawingLine') {
			this.ciq.changeVectorParameter('currentColor', '#' + color);
		}
	};

	setLinePattern(newClass, newWidth, newPattern) {
		// Set the info for the toolbar menu
		this.selectedLineClass = newClass;
		// Activate the new parameters
		this.ciq.changeVectorParameter('lineWidth', newWidth);
		this.ciq.changeVectorParameter('pattern', newPattern);
	}

	setFontSize(newSize) {
		this.fontSize = newSize + 'px';
		this.ciq.changeVectorParameter('fontSize', newSize + 'px');
	}

	setFontFamily(newFamily) {
		this.fontFamily = newFamily;
		this.ciq.changeVectorParameter('fontFamily', newFamily);
	}

	toggleStyle(newStyle) {
		if (newStyle == 'bold') {
			if (!this.bold) {
				this.ciq.changeVectorParameter('fontWeight', 'bold');
				this.bold = true;
			} else {
				this.ciq.changeVectorParameter('fontWeight', 'normal');
				this.bold = false;
			}
		} else if (newStyle == 'italic') {
			if (!this.italic) {
				this.ciq.changeVectorParameter('fontStyle', 'italic');
				this.italic = true;
			} else {
				this.ciq.changeVectorParameter('fontStyle', 'normal');
				this.italic = false;
			}
		}
	}
}
