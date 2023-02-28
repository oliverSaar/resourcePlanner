import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './modules/material.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlannerComponent } from './components/planner/planner.component';
import { CalendarComponent } from './components/calendar/calendar.component';

import { SettingsComponent } from './components/settings/settings.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { ListHabitComponent } from './components/planner/list-habit/list-habit.component';
import { CalendarBundleModule } from './modules/calendar.module';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { HabitHelpComponent } from './dialogues/habit-help/habit-help.component';
import { FormComponent } from './dialogues/form/form.component';
import { FormDialogComponent } from './dialogues/form-dialog/form-dialog.component';
import { MapComponent } from './components/map/map.component';
import { EmployeeComponent } from './components/employee/employee.component';

/**
 * Registering Language Localization
 */
registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PlannerComponent,
    CalendarComponent,
    SettingsComponent,
    SafeHtmlPipe,
    ListHabitComponent,
    HabitHelpComponent,
    FormComponent,
    FormDialogComponent,
    MapComponent,
    EmployeeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    CalendarBundleModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
