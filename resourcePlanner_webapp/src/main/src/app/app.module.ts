import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CalendarComponent} from "./calendar/calendar.component";
import {EmployeesComponent} from "./employees/employees.component";
import {ProjectsComponent} from "./projects/projects.component";


@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    EmployeesComponent,
    ProjectsComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
