import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChartService } from './chart_service/chart.service';

import { MapObjectToArrayPipe, TitlecasePipe } from './pipes';

import {
	ChartUI,
	ChartComponent,
	OverlayMenu,
	Colorpicker,
	StudyDialog,
	ThemeDialog,
	TimezoneDialog,
	DrawingToolbar,
} from './components';

@NgModule({
	declarations: [
		AppComponent,
		ChartUI,
		ChartComponent,
		DrawingToolbar,
		StudyDialog,
		ThemeDialog,
		TimezoneDialog,
		OverlayMenu,
		Colorpicker,
		MapObjectToArrayPipe,
		TitlecasePipe,
	],
	imports: [BrowserModule, FormsModule],
	providers: [ChartService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	bootstrap: [AppComponent],
})
export class AppModule {}
