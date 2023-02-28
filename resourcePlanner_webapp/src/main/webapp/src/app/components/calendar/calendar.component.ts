import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  LOCALE_ID,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
  CalendarUtils as CalendarUtilsClass,
  CalendarView,
} from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject } from 'rxjs';
import { Event } from 'src/app/models/event.model';
import { AppComponent } from 'src/app/app.component';
import { MatDialog } from '@angular/material/dialog';
import { EventTitleFormatter } from 'src/app/providers/event-title-formatter.provider';
import { CalendarUtils } from 'src/app/providers/calendar-utils.provider';
import { DateFormatter } from 'src/app/providers/date-formatter.provider';
import { Habit } from 'src/app/models/habit.model';
import { UtilDate } from 'src/app/models/util.model';
import { FormDialogComponent } from 'src/app/dialogues/form-dialog/form-dialog.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: EventTitleFormatter,
    },
    {
      provide: CalendarUtilsClass,
      useClass: CalendarUtils,
    },
    {
      provide: CalendarDateFormatter,
      useClass: DateFormatter,
    },
  ],
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  abteilungen: String[] = ['Projektsteuerung', 'POS Prozesse', 'Softwareentwicklung', 'Netzwerk', 'Stammdaten'];

  abteilung: String = '';
  viewDate: Date = new Date();

  activeDayIsOpen: boolean = false;

  today: Date = new Date();

  refresh = new Subject<void>();

  events: Event[] = [];

  navigation: string = 'today';

  constructor(
    private dialog: MatDialog,
    @Inject(LOCALE_ID) public locale: string
  ) {
    // Update event list
    this.refresh.subscribe(() => this.refreshEvents());
    // Update selected day
    this.refresh.subscribe(() => {
      for (const event of this.events) {
        if (
          isSameDay(event.start, this.viewDate) ||
          UtilDate.isBetweenTimespan(this.viewDate, event.start, event.end)
        ) {
          this.activeDayIsOpen = true;
          return;
        }
      }
      this.activeDayIsOpen = false;
    });
  }

  ngOnInit(): void {
    AppComponent.data.recalculate();
    this.refresh.next();
  }

  /**
   * Set current view
   * @param view View mode
   */
  setView(view: CalendarView) {
    this.view = view;
  }

  /**
   * Close view
   */
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  /**
   * On click of calendar day
   * @param param0 Click event
   */
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen) ||
        events.length === 0);
      this.viewDate = date;
    }
  }

  /**
   * On change of date times
   * @param param0 Event parameter
   */
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.handleEvent('DroppedOrResized', event as Event, {
      start: newStart,
      end: newEnd,
    });
  }

  /**
   * Handle an action
   * @param action Calendar action
   * @param event Calendar event
   * @param options Additional options
   */
  handleEvent(
    action: string,
    event: CalendarEvent<any> | Event,
    options?: any
  ): void {
    switch (action) {
      case 'Clicked':
        this.openEdit(event as Event);
        break;
      case 'DroppedOrResized':
        this.changeEventTimes(event as Event, options);
        break;
      default:
        console.log({ event, action });
    }
  }

  /**
   * Add an Event to list and calendar.
   * (Will refresh the view of the calendar)
   * @param event The Event to add
   */
  addEvent(event: Event): void {
    AppComponent.data.addEvent(event);
    this.refresh.next();
  }

  /**
   * Delete an Event from list and calendar.
   * @param event The Event to delete
   * @param isHabit
   */
  //test 2
  deleteEvent(event: Event | Habit, isHabit?: boolean) {
    if (isHabit)
      AppComponent.data.deleteHabit(
        (event.reference ? event.reference : event) as Habit
      );
    else
      AppComponent.data.deleteEvent(event.reference ? event.reference : event);
  }

  /**
   * On change of an events times
   * @param event The event that was changed
   * @param times The new time it changed to
   */
  changeEventTimes(event: Event, times: { start: Date; end: Date }) {
    let ref = event.reference!;
    // If it is a repeating event, only change time, not date
    if (ref.repeat) {
      ref.start = UtilDate.setDayTime(ref.start, times.start);
      ref.end = UtilDate.setDayTime(ref.end, times.end);
    } else {
      ref.start = times.start;
      ref.end = times.end;
    }
    AppComponent.data.recalculate();
    this.refresh.next();
  }

  /**
   * Open the dialog for adding an Event
   */
  openAdd(): void {
    let event: Event = new Event({});
    // Set to currently selected Datey
    event.start.setFullYear(this.viewDate.getFullYear());
    event.start.setMonth(this.viewDate.getMonth());
    event.start.setDate(this.viewDate.getDate());
    event.end.setFullYear(this.viewDate.getFullYear());
    event.end.setMonth(this.viewDate.getMonth());
    event.end.setDate(this.viewDate.getDate());

    // Open dialog
    const ref = this.dialog.open(FormDialogComponent, {
      data: {
        event: event,
        isEditMode: false,
      },
      disableClose: true,
    });

    // Fetch action
    ref.afterClosed().subscribe((result) => {
      if (result != 'Add') return;
      this.addEvent(event);
    });
  }

  /**
   * Open the dialog for editing an Event
   * @param event The Event to edit
   */
  openEdit(event: Event | Habit): void {
    const isHabit = Habit.isHabit(event);

    // Make copy
    let copy: Event | Habit = isHabit
      ? new Habit(event.reference)
      : new Event(event.reference);

    // Open dialog
    const ref = this.dialog.open(FormDialogComponent, {
      data: {
        event: event.reference,
        refresh: this.refresh,
        isEditMode: true,
        isHabit: isHabit,
      },
      disableClose: true,
    });

    // Fetch action
    ref.afterClosed().subscribe((result) => {
      switch (result) {
        case 'Save':
          AppComponent.data.recalculate();
          break;
        case 'Delete':
          this.deleteEvent(event, isHabit);
          break;
        default:
          Object.assign(event.reference!, copy);
          break;
      }
      this.refresh.next();
    });
  }

  /**
   * Get current event list of data
   */
  refreshEvents(): void {
    this.events = AppComponent.data.getEvents();
  }

  /**
   * On change of date navigation
   * @param event Selection event
   * @param element Selection element
   */
  onNavigationChange(event: any, element: any): void {
    if (event != undefined) element.value = undefined;
  }
}
