import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  exports: [
    NgbModule,
    CommonModule
  ]
})
export class CalendarBundleModule {}
