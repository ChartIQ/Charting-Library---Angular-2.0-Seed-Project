import {
	Component,
	Output,
	EventEmitter,
	Input,
	ChangeDetectionStrategy,
} from '@angular/core';

import { ChartComponent } from '../chart_component/chart.component';
import { ChartService } from 'src/app/services';

@Component({
	selector: 'drawing-toolbar',
	templateUrl: './drawing.toolbar.component.html',
	// changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawingToolbar {
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

	constructor(private chartService: ChartService) {
		this.drawingTools = this.chartService.getDrawingToolList();
	}

	toggleDrawingToolbar() {
		this.open = !this.open;
		if (!this.open) {
			this.selectedTool = false;
			this.toolParams = false;
			this.fillColor = false;
			this.lineColor = false;
			this.lineWidth = false;
			this.pattern = false;
			this.chartService.setDrawingTool('');
		}
		this.chartContainer.showToolbar(this.open);
		return this.open;
	}

	setTool(tool) {
		// Set all the info for the toolbar
		this.selectedTool = tool;
		this.showFontOptions = /callout|annotation/i.test(tool);
		if (this.showFontOptions) {
			// Sync the defaults for font tool
			const {
				fontSize,
				fontFamily,
			} = this.chartService.setDrawingFontFromStyle();

			Object.assign(this, { fontSize, fontFamily });
			this.showFontOptions = true;
		}

		const {
			color,
			fillColor,
			lineWidth,
			pattern,
		} = this.chartService.getDrawingParameters(tool);

		Object.assign(this, {
			fillColor,
			lineWidth,
			pattern,
			toolParams: true,
			lineColor: color === 'auto' ? 'white' : 'color',
			selectedLineClass:
				lineWidth && pattern ? `ciq-${pattern}-${lineWidth}` : '',
		});
		this.chartService.setDrawingTool(tool);
	}

	launchColorpicker(setting, { target: swatch }) {
		this.chartService.showColorPicker(swatch, color => {
			this.chartService.setDrawingParameter(
				setting === 'Fill' ? 'fillColor' : 'currentColor',
				color
			);
			swatch.style.backgroundColor = color;
		});
	}

	setLinePattern(newClass, newWidth, newPattern) {
		// Set the info for the toolbar menu
		this.selectedLineClass = newClass;
		// Activate the new parameters
		this.chartService.setDrawingParameter('lineWidth', newWidth);
		this.chartService.setDrawingParameter('pattern', newPattern);
	}

	setFontSize(newSize) {
		this.fontSize = newSize + 'px';
		this.chartService.setDrawingParameter('fontSize', newSize + 'px');
	}

	setFontFamily(newFamily) {
		this.fontFamily = newFamily;
		this.chartService.setDrawingParameter('fontFamily', newFamily);
	}

	toggleStyle(newStyle) {
		const { bold, italic } = this;
		if (newStyle == 'bold') {
			this.chartService.setDrawingParameter(
				'fontWeight',
				bold ? 'normal' : 'bold'
			);
			this.bold = !bold;
		} else if (newStyle == 'italic') {
			this.chartService.setDrawingParameter(
				'fontStyle',
				italic ? 'normal' : 'italic'
			);
			this.italic = !italic;
		}
	}
}
