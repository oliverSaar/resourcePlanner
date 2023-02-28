import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Event } from 'src/app/models/event.model';
import { Habit } from 'src/app/models/habit.model';
import { UtilDate } from 'src/app/models/util.model';
import { HabitHelpComponent } from '../habit-help/habit-help.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements AfterViewInit {
  @Output() savedEvent: EventEmitter<Event | Habit> = new EventEmitter<
    Event | Habit
  >();

  @Output() deleteEvent: EventEmitter<Event | Habit> = new EventEmitter<
    Event | Habit
  >();

  @Output() cancelEvent: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Event or Habit reference
   */
  @Input() event: Event | Habit;

  /**
   * Subject for refreshing external UI
   */
  @Input() refresh?: any;

  /**
   * If event is a habit
   */
  @Input() isHabit: boolean;

  /**
   * If editing an event or creating a new one
   */
  @Input() isEditMode: boolean;

  /**
   * If component is a dialog
   */
  @Input() isDialog: boolean;

  /**
   * If event is repeating
   */
  isRepeating: boolean = false;

  /**
   * Current selected tab for repeating options
   */
  selectedTab: number = 0;

  /**
   * Form group for individual controls
   */
  form: FormGroup = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),

    colorPrimary: new FormControl(),
    colorSecondary: new FormControl(),

    startDate: new FormControl(),
    endDate: new FormControl(),

    startTime: new FormControl(),
    endTime: new FormControl(),

    idealTime: new FormControl(),
    duration: new FormControl(),

    days: new FormControl(),

    count: new FormControl(),
    deadline: new FormControl(),
  });

  /**
   * Array for selecting repeating days
   */
  days: any[];

  /**
   * If form is initialized
   */
  isInitialized = false;

  constructor(
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef
  ) {
    this.days = UtilDate.getDays();
    this.event = new Event({});
    this.isHabit = false;
    this.isEditMode = false;
    this.isDialog = false;
  }

  /**
   * Initialize UI to show correct data
   * @param event Event to show data of
   */
  initializeControls(event?: Event): void {
    this.isInitialized = false;
    if (!event) event = this.event;
    else this.event = event;
    this.isRepeating = event.repeat != undefined;

    this.setValue('title', event.title);
    this.setValue('description', event.description ? event.description : '');

    this.setValue('colorPrimary', event.color.primary);
    this.setValue('colorSecondary', event.color.secondary);

    this.setValue('startDate', event.start);
    this.setValue('endDate', event.end);

    this.setValue('startTime', event.start);
    this.setValue('endTime', event.end);

    if (this.isHabit) {
      this.setValue('idealTime', (event as Habit).idealTime);
      this.setValue('duration', (event as Habit).duration);

      if (!this.isRepeating) {
        this.repeatingChanged(true);
      }
    }

    if (this.isRepeating) {
      this.setValue('days', event.repeat?.days);

      if (typeof event.repeat?.repeating === 'number') {
        this.changeSelectedTab(1);
        this.setValue('count', event.repeat?.repeating);
      } else {
        this.changeSelectedTab(2);
        this.setValue('deadline', event.repeat?.repeating);
      }
    }

    this.initializeListeners();
    this.isInitialized = true;
  }

  /**
   * Initialize all form listeners
   */
  initializeListeners(): void {
    this.form.controls['title'].valueChanges.subscribe((value) => {
      this.titleChanged(value);
    });
    this.form.controls['description'].valueChanges.subscribe((value) => {
      this.descriptionChanged(value);
    });
    this.form.controls['colorPrimary'].valueChanges.subscribe((value) => {
      this.colorPrimaryChanged(value);
    });
    this.form.controls['colorSecondary'].valueChanges.subscribe((value) => {
      this.colorSecondaryChanged(value);
    });
    this.form.controls['startDate'].valueChanges.subscribe((value) => {
      this.startDateChanged(value);
    });
    this.form.controls['endDate'].valueChanges.subscribe((value) => {
      this.endDateChanged(value);
    });
    this.form.controls['startTime'].valueChanges.subscribe((value) => {
      this.startTimeChanged(value);
    });
    this.form.controls['endTime'].valueChanges.subscribe((value) => {
      this.endTimeChanged(value);
    });
    this.form.controls['idealTime'].valueChanges.subscribe((value) => {
      this.idealTimeChanged(value);
    });
    this.form.controls['duration'].valueChanges.subscribe((value) => {
      this.durationChanged(value);
    });
    this.form.controls['days'].valueChanges.subscribe((value) => {
      this.daysChanged(value);
    });
    this.form.controls['count'].valueChanges.subscribe((value) => {
      this.countChanged(value);
    });
    this.form.controls['deadline'].valueChanges.subscribe((value) => {
      this.deadlineChanged(value);
    });
  }

  /**
   * Set a safe value for a control
   * @param control The control to set value for
   * @param value The value to set
   */
  setValue(control: string, value: any): void {
    if (value == undefined) return;
    this.form.controls[control].setValue(value);
  }

  ngAfterViewInit(): void {
    // Suppress expression changed error
    this.changeDetector.detectChanges();
  }

  /**
   * Validator for the whole form
   * @returns `true` if everything is correctly filled out
   */
  isFormValid(): boolean {
    if (!this.event.title) return false;
    if (!this.event.start) return false;
    if (!this.event.end) return false;
    if (!this.event.color.primary) return false;
    if (!this.form.controls['endDate'].value) return false;
    return true;
  }

  /**
   * Checks if a day of the week is the same as the currently selected
   * @param dayWeekNumber Day of the week as number [Sunday=0, Monday=1, Tuesday=2, ...]
   * @returns `true` if is same day
   */
  isCurrentDay(dayWeekNumber: number): boolean {
    return this.event.start.getDay() == dayWeekNumber;
  }

  /**
   * Refresh selection UI for days
   */
  refreshDays(): void {
    this.setValue('days', [this.event.start.getDay()]);
  }

  /**
   * The minimal possible time to select
   * @returns Date of the event start
   */
  minTime(): Date {
    return new Date(this.event.start);
  }

  /**
   * The maximal possible time to select
   * @returns Date of the event end
   */
  maxTime(): Date {
    return new Date(this.event.end);
  }

  /**
   * The maximal duration to select
   * @returns Duration between ideal time and end date
   */
  maxDuration(): number {
    return (
      UtilDate.diffTime((this.event as Habit).idealTime, this.event.end) /
      UtilDate.TIME.ONE_MINUTE
    );
  }

  /**
   * Change the selected repeating tab
   * @param index Tab index
   */
  changeSelectedTab(index: number) {
    if (this.isHabit) index--;
    this.selectedTab = index;
  }

  /**
   * On change of tab selection
   * @param event Tab event
   */
  tabChange(event: any): void {
    this.selectedTab = event.index;
    let adjustedTab = this.isHabit ? this.selectedTab + 1 : this.selectedTab;

    this.repeatingChanged(adjustedTab > 0);

    switch (adjustedTab) {
      case 1:
        this.setValue('count', 1);
        break;
      case 2:
        this.setValue('deadline', this.event.end);
        break;
    }
  }

  /**
   * Open help dialog for habit
   */
  openHelp(): void {
    this.dialog.open(HabitHelpComponent);
  }

  /**
   * On save emit saved element
   */
  saveClicked(): void {
    this.savedEvent.emit(this.event);
  }

  /**
   * On cancel emit
   */
  cancelClicked(): void {
    this.cancelEvent.emit(this.event);
  }

  /**
   * On delete emit element
   */
  deleteClicked(): void {
    this.deleteEvent.emit();
  }

  //** Handler **//

  titleChanged(value: string): void {
    this.event.title = value;
  }

  descriptionChanged(value: string): void {
    this.event.description = value;
  }

  colorPrimaryChanged(value: string): void {
    if (this.event.color != undefined) this.event.color.primary = value;
    else this.event.color = { primary: value, secondary: '#ffffff' };
  }

  colorSecondaryChanged(value: string): void {
    if (this.event.color != undefined) this.event.color.secondary = value;
    else this.event.color = { primary: '#ffffff', secondary: value };
  }

  startDateChanged(value: Date): void {
    if (value == null) return;
    this.event.start.setFullYear(value.getFullYear());
    this.event.start.setMonth(value.getMonth());
    this.event.start.setDate(value.getDate());
    this.setValue('startTime', this.event.start);
    this.refreshDays();

    if (this.isRepeating) {
      this.event.end = UtilDate.setDayTime(this.event.start, this.event.end);
      this.setValue('endTime', this.event.end);

      if (
        this.selectedTab == (this.isHabit ? 1 : 2) &&
        (this.event.repeat?.repeating as Date) < this.event.start
      )
        this.setValue('deadline', this.event.start);
    }
  }

  endDateChanged(value: Date): void {
    if (value == null) return;
    this.event.end.setFullYear(value.getFullYear());
    this.event.end.setMonth(value.getMonth());
    this.event.end.setDate(value.getDate());
    this.setValue('endTime', this.event.end);
  }

  startTimeChanged(value: Date): void {
    if (value == null) return;
    this.event.start.setHours(value.getHours());
    this.event.start.setMinutes(value.getMinutes());
    this.event.start.setSeconds(value.getSeconds());

    if (this.event.end < this.event.start) {
      this.event.end = new Date(this.event.start);
      this.setValue('endTime', new Date(this.event.end));
      this.changeDetector.detectChanges();
    }

    if (this.isHabit && this.event.start > (this.event as Habit).idealTime) {
      (this.event as Habit).idealTime = new Date(this.event.start);
      this.setValue('idealTime', new Date(this.event.start));
    }
  }

  endTimeChanged(value: Date): void {
    if (value == null) return;
    this.event.end.setHours(value.getHours());
    this.event.end.setMinutes(value.getMinutes());
    this.event.end.setSeconds(value.getSeconds());

    if (this.isHabit && this.event.end <= (this.event as Habit).idealTime) {
      (this.event as Habit).idealTime = new Date(this.event.end);
      this.setValue('idealTime', new Date(this.event.end));
    }
  }

  idealTimeChanged(value: Date): void {
    if (value == null) return;
    (this.event as Habit).idealTime.setHours(value.getHours());
    (this.event as Habit).idealTime.setMinutes(value.getMinutes());
    (this.event as Habit).idealTime.setSeconds(value.getSeconds());

    if (this.event.start > (this.event as Habit).idealTime) {
      (this.event as Habit).idealTime = new Date(this.event.start);
      this.setValue('idealTime', new Date(this.event.start));
    }
    if (this.event.end < (this.event as Habit).idealTime) {
      (this.event as Habit).idealTime = new Date(this.event.end);
      this.setValue('idealTime', new Date(this.event.end));
    }
  }

  durationChanged(value: number): void {
    (this.event as Habit).duration = value;
  }

  daysChanged(value: UtilDate.DAY[]): void {
    if (this.event.repeat == undefined) return;
    this.event.repeat!.days = value;
  }

  countChanged(value: number): void {
    this.event.repeat!.repeating = value;
  }

  deadlineChanged(value: Date): void {
    this.event.repeat!.repeating = value;
  }

  repeatingChanged(value: boolean): void {
    this.isRepeating = value;

    if (this.isRepeating) {
      if (this.event.repeat == undefined) {
        this.event.repeat = {
          days: [this.event.start.getDay()],
          repeating: 1,
        };
      }
      this.setValue('endDate', this.event.start);
      this.refreshDays();
    } else {
      this.event.repeat = undefined;
    }
  }
}
