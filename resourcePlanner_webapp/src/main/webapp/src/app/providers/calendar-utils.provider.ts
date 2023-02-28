import { Injectable } from '@angular/core';
import { CalendarUtils as CalendarUtilsClass } from 'angular-calendar';
import { GetMonthViewArgs, MonthView } from 'calendar-utils';
import { addWeeks, endOfMonth, startOfMonth, subWeeks } from 'date-fns';

@Injectable()
export class CalendarUtils extends CalendarUtilsClass {
  override getMonthView(args: GetMonthViewArgs): MonthView {
    args.viewStart = subWeeks(startOfMonth(args.viewDate), 0.5);
    args.viewEnd = addWeeks(endOfMonth(args.viewDate), 0.5);
    return super.getMonthView(args);
  }
}
