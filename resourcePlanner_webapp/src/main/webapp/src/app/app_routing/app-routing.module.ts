import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CalendarComponent} from '../calendar/calendar.component';
import {ProjectsComponent} from '../projects/projects.component';

const routes: Routes = [

  {path: 'calendar', component: CalendarComponent},
  {path: 'projects', component: ProjectsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
