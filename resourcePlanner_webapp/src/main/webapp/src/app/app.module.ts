import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MaterialModule} from './modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule } from '@angular/forms';
import { CalendarBundleModule } from './modules/calendar.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import {CalendarComponent} from './calendar/calendar.component';
import {AppRoutingModule} from './app_routing/app-routing.module';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {EmployeesComponent} from './employees/employees.component';
import {ProjectsComponent} from './projects/projects.component';



@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    EmployeesComponent,
    ProjectsComponent,
    SafeHtmlPipe
  ],
  imports: [
    MatButtonToggleModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    CalendarBundleModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FlatpickrModule.forRoot(),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
