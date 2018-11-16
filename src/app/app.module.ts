import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { ChartComponent } from './chart_component/chart.component';
import { ChartService } from './chart_service/chart.service';
import { ChartUI } from './ui_component/ui.component';
import { Colorpicker } from './colorpicker_component/colorpicker';
import { MapObjectToArrayPipe } from './pipes/mapObject.pipe';
import { StudyDialog } from './study_dialog_component/study.dialog.component';
import { ThemeDialog } from './theme_dialog_component/theme.dialog.component';
import { TimezoneDialog } from './timezone_dialog_component/timezone.dialog.component';
import { OverlayMenu } from './overlay_menu_component/overlay.menu';
import { DrawingToolbar } from './drawing_toolbar_component/drawing.toolbar.component';
import { TitlecasePipe } from './pipes/title.case.pipe'

@NgModule({
  declarations: [
    AppComponent,
    ChartComponent,
    ChartUI,
    Colorpicker,
    MapObjectToArrayPipe,
    StudyDialog,
    ThemeDialog,
    TimezoneDialog,
    OverlayMenu,
    DrawingToolbar,
    TitlecasePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [
    ChartService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
