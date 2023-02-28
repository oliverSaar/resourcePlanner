import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Habit } from 'src/app/models/habit.model';
import { UtilDate } from 'src/app/models/util.model';

@Component({
  selector: 'app-list-habit',
  templateUrl: './list-habit.component.html',
  styleUrls: ['./list-habit.component.scss'],
})
export class ListHabitComponent implements OnInit {
  @Input() habits: Habit[] = [];

  @Output() selectedHabit: EventEmitter<Habit> = new EventEmitter<Habit>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'color',
    'title',
    'description',
    'time',
    'repeat',
    'actions',
  ];
  dataSource!: MatTableDataSource<Habit>;

  days: any[];

  constructor() {
    this.days = UtilDate.getDays();
  }

  ngOnInit(): void {
    this.updateList();
  }

  /**
   * Update table list and paginator
   */
  updateList(): void {
    this.dataSource = new MatTableDataSource<Habit>(this.habits);
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Calculate percentage for width of start/end timespan
   * @param element Habit
   * @returns Percentage
   */
  calcTimespan(element: Habit): number {
    let timespan = element.end.getTime() - element.start.getTime();
    let percentage = (timespan / UtilDate.TIME.ONE_DAY) * 100;
    return percentage;
  }

  /**
   * Calculate percentage for offset of start/end timespan
   * @param element Habit
   * @returns Percentage
   */
  calcTimespanOffset(element: Habit): number {
    let startDate = new Date(element.start);
    startDate.setSeconds(0);
    startDate.setMinutes(0);
    startDate.setHours(0);
    let timespan = element.start.getTime() - startDate.getTime();
    let percentage = (timespan / UtilDate.TIME.ONE_DAY) * 100;
    return percentage;
  }

  /**
   * Calculate percentage for width of idealTime/duration timespan
   * @param element Habit
   * @returns Percentage
   */
  calcTime(element: Habit): number {
    let idealTime = new Date(element.idealTime);
    idealTime.setMinutes(idealTime.getMinutes() + element.duration);
    let timespan = idealTime.getTime() - element.idealTime.getTime();
    let percentage =
      (timespan / (element.end.getTime() - element.start.getTime())) * 100;
    return percentage;
  }

  /**
   * Calculate percentage for offset of idealTime/duration timespan
   * @param element Habit
   * @returns Percentage
   */
  calcTimeOffset(element: Habit): number {
    let timespan = element.idealTime.getTime() - element.start.getTime();
    let percentage =
      (timespan / (element.end.getTime() - element.start.getTime())) * 100;
    return percentage;
  }

  /**
   * Checks if a day of the week is the same as the currently selected
   * @param element Habit
   * @param dayWeekNumber Day of the week as number [Sunday=0, Monday=1, Tuesday=2, ...]
   * @returns `true` if is same day
   */
  isCurrentDay(element: Habit, dayWeekNumber: number): boolean {
    return element.start.getDay() == dayWeekNumber;
  }

  /**
   * Toggle repeating day
   * @param element Habit
   * @param dayWeekNumber Day of the week as number
   */
  toggleDay(element: Habit, dayWeekNumber: number): void {
    if (this.isCurrentDay(element, dayWeekNumber)) return;
    if (element.repeat?.days.includes(dayWeekNumber))
      element.repeat.days.splice(element.repeat.days.indexOf(dayWeekNumber), 1);
    else element.repeat?.days.push(dayWeekNumber);
  }

  /**
   * Get ideal time
   * @param element Habit 
   * @returns Date string
   */
  getIdealTime(element: Habit): string {
    return element.idealTime.toISOString();
  }
}
