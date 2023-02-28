import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CalendarComponent} from './components/calendar/calendar.component';
import {SettingsComponent} from './components/settings/settings.component';
import {EmployeeComponent} from "./components/employee/employee.component";

const routes: Routes = [
  {path: 'calendar', component: CalendarComponent},
  {path: 'employees', component: EmployeeComponent},
  {path: 'settings', component: SettingsComponent},
  {path: '**', redirectTo: 'calendar'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
