import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { FormComponent } from 'src/app/dialogues/form/form.component';
import { Data } from 'src/app/models/data.model';
import { Event } from 'src/app/models/event.model';
import { Habit } from 'src/app/models/habit.model';
import { ListHabitComponent } from './list-habit/list-habit.component';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss'],
})
export class PlannerComponent implements OnInit {
  habit: Habit = new Habit({});
  habitCopy?: Habit;
  selectedHabit?: Habit;

  form!: FormComponent;

  @ViewChild(FormComponent)
  set formComp(formComponent: FormComponent) {
    formComponent.initializeControls();
    this.form = formComponent;
  }

  list!: ListHabitComponent;

  @ViewChild(ListHabitComponent)
  set listComp(listHabitComponent: ListHabitComponent) {
    listHabitComponent.updateList();
    this.list = listHabitComponent;
  }

  constructor(private detector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.detector.detectChanges();
  }

  get data(): Data {
    return AppComponent.data;
  }

  /**
   * Add new habit to data
   * @param habit New habit
   */
  addHabit(habit: Habit | Event): void {
    this.data.addHabit(new Habit(habit));
    this.habit = new Habit({});
    this.form.initializeControls(this.habit);
    this.list.updateList();
  }

  /**
   * Save current changes of selected habit
   * @param habit Selected habit
   */
  saveHabit(habit: Habit | Event): void {
    // Reset selection
    this.selectedHabit = undefined;
    this.habitCopy = undefined;
  }

  /**
   * Cancel current changes of selected habit
   */
  cancelHabit(): void {
    // Revert changes
    Object.assign(this.selectedHabit!, this.habitCopy);

    // Reset selection
    this.selectedHabit = undefined;
    this.habitCopy = undefined;
  }

  /**
   * Delete currently selected habit
   * @param habit Selected habit
   */
  deleteHabit(habit: Habit | Event): void {
    // Delete from list
    AppComponent.data.deleteHabit(this.selectedHabit!);

    // Refresh UI
    this.selectedHabit = undefined;
    this.habitCopy = undefined;
    this.detector.detectChanges();

    // Update list
    this.list.updateList();
  }

  /**
   * Set selected habit
   * @param habit Selected habit
   */
  habitSelected(habit: Habit): void {
    // Revert unsaved changes
    if (this.habitCopy) this.cancelHabit();

    // Refresh UI
    this.selectedHabit = undefined;
    this.detector.detectChanges();

    // Set selection
    this.habitCopy = new Habit(habit);
    this.selectedHabit = habit;
  }
}
