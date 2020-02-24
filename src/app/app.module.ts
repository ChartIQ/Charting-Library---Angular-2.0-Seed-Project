import {
	NgModule,
	CUSTOM_ELEMENTS_SCHEMA,
	APP_INITIALIZER,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';

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

import { MapObjectToArrayPipe, TitlecasePipe } from './pipes';
import { ConfigService, loadConfig } from './services';

import { ITfc } from './plugins/tfc.interface';
// to enable tfc plugin uncomment next line
// import { TfcService } from './plugins/tfc.service';


import "chartiq/plugins/timespanevent/timespanevent";
import "chartiq/plugins/timespanevent/examples/timeSpanEventSample"; 

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
	imports: [BrowserModule, FormsModule, HttpClientModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: loadConfig,
			deps: [HttpClient, ConfigService],
			multi: true,
		},
		// to enable tfc plugin uncomment next line
		// { provide: ITfc, useClass: TfcService },
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
