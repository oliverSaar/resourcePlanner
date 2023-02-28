import { Event } from './event.model';
import { HabitEvent } from './habit-event.model';
import { Habit } from './habit.model';
import { UtilDate, UtilObject } from './util.model';

export class Data {
  /**
   * List for all events
   */
  _events: Event[];

  /**
   * List for all habits
   */
  _habits: Habit[];

  constructor(obj: any) {
    this._events = UtilObject.parseArray(Event, obj.events);
    this._habits = UtilObject.parseArray(Habit, obj.habits);
  }

  get events(): Event[] {
    return this.getEvents();
  }

  /**
   * Add an {@link Event Event} to the list.
   * This will trigger recalculation of the alternate {@link HabitEvent HabitEvents}.
   * @param event Event to add
   */
  addEvent(event: Event): void {
    this._events.push(event);
    this.recalculate();
  }

  /**
   * Add an {@link Habit Habit} to the list.
   * This will trigger recalculation of the alternate {@link HabitEvent HabitEvents}.
   * @param habit Habit to add
   */
  addHabit(habit: Habit): void {
    this._habits.push(habit);
    this.recalculate();
  }

  /**
   * Delete an {@link Event Event} of the list.
   * @param element An {@link Event Event} or the index
   */
  deleteEvent(element: Event | number): void {
    var event: Event;
    if (typeof element === 'number') event = this._events[element as number];
    else event = element as Event;

    this._events = this._events.filter(
      (item) => !UtilObject.equals(item, event)
    );
    this.recalculate();
  }

  /**
   * Delete an {@link Habit Habit} of the list.
   * @param element A {@link Habit Habit} or the index
   */
  deleteHabit(element: Habit | number): void {
    var habit: Habit;
    if (typeof element === 'number') habit = this._habits[element as number];
    else habit = element as Habit;

    this._habits = this._habits.filter(
      (item) =>
        !UtilObject.equals(
          item,
          Object.assign(habit, { alternateEvents: [], reference: undefined })
        )
    );
    this.recalculate();
  }

  /**
   * Recalculate all alternate {@link HabitEvent HabitEvents}.
   */
  recalculate(): void {
    const events: Event[] = [];
    for (const event of this._events) {
      for (const mEvent of event.getEvents()) {
        events.push(mEvent);
      }
    }
    events.sort((a, b) => (a.start.getTime() > b.start.getTime() ? 1 : -1));

    for (const habit of this._habits) {
      habit.alternateEvents = [];
      for (const mHabit of habit.getHabits()) {
        this.recalculateHabits(habit, mHabit as Habit, events);
      }
    }
  }

  /**
   * Recalculate for a single habit
   * @param habit The habit to recalculate for
   * @param mHabit The single event of habit
   * @param events All events
   */
  recalculateHabits(habit: Habit, mHabit: Habit, events: Event[]): void {
    for (const event of events) {
      if (
        UtilDate.isOverlapping(mHabit.start, mHabit.end, event.start, event.end)
      ) {
        habit.alternateEvents.push(
          this.calculateAlternateEvent(mHabit, events)
        );
        return;
      }
    }
  }

  /**
   * Calculate a single alternate event
   * @param habitEvent Single habit event to alternate
   * @param events Event list to check against
   * @returns Alternated habit event
   */
  calculateAlternateEvent(habitEvent: Event, events: Event[]): HabitEvent {
    const alternate = new HabitEvent(habitEvent);
    const habit = new Habit(habitEvent.reference);
    const idealTime = UtilDate.setDayTime(alternate.start, habit.idealTime);
    habit.start = UtilDate.setDayTime(alternate.start, habit.start);
    habit.end = UtilDate.setDayTime(alternate.end, habit.end);
    const filteredEvents = events.filter((x) =>
      UtilDate.isOverlapping(habit.start, habit.end, x.start, x.end)
    );
    const timeSlots: { start: Date; end: Date; duration: number }[] = [];

    // Sort after start date
    filteredEvents.sort((a, b) =>
      a.start.getTime() > b.start.getTime() ? 1 : -1
    );
    // Calculate available time between start of habit range and first event
    const firstEvent = filteredEvents[0];
    if (
      !UtilDate.isBetweenTimespan(habit.start, firstEvent.start, firstEvent.end)
    ) {
      const firstSlot = UtilDate.calculateTimeSlot(
        firstEvent.start,
        habit.start
      );
      if (firstSlot.duration > habit.duration * UtilDate.TIME.ONE_MINUTE)
        timeSlots.push(firstSlot);
    }

    // Calculate available times between start and end of habit with each event in between
    for (let i = 1; i < filteredEvents.length; i++) {
      const first = filteredEvents[i - 1];
      const second = filteredEvents[i];

      if (
        UtilDate.isOverlapping(first.start, first.end, second.start, second.end)
      )
        break;
      const newSlot = UtilDate.calculateTimeSlot(second.start, first.end);
      if (newSlot.duration > habit.duration * UtilDate.TIME.ONE_MINUTE)
        timeSlots.push(newSlot);
    }

    // Sort after end date
    filteredEvents.sort((a, b) => (a.end.getTime() > b.end.getTime() ? 1 : -1));
    // Calculate available time between end of habit range and last event
    const lastEvent = filteredEvents[filteredEvents.length - 1];
    if (
      !UtilDate.isBetweenTimespan(habit.end, lastEvent.start, lastEvent.end)
    ) {
      const lastSlot = UtilDate.calculateTimeSlot(lastEvent.end, habit.end);
      if (lastSlot.duration > habit.duration * UtilDate.TIME.ONE_MINUTE)
        timeSlots.push(lastSlot);
    }

    // Get nearest time slot to ideal time
    let nearestSlot: {
      difference: number;
      isStart: boolean;
      slot: { start: Date; end: Date; duration: number } | undefined;
    } = { difference: Number.MAX_VALUE, isStart: false, slot: undefined };
    for (const slot of timeSlots) {
      // Calculate differences from start ad beginning of timespan
      let diffStart = Math.abs(idealTime.getTime() - slot.start.getTime());
      let diffEnd = Math.abs(idealTime.getTime() - slot.end.getTime());

      // Select nearest difference
      let isStartNearest;
      let shortestDiff;
      if (diffStart < diffEnd) {
        shortestDiff = diffStart;
        isStartNearest = true;
      } else {
        shortestDiff = diffEnd;
        isStartNearest = false;
      }

      // If difference is smaller, set new difference to current slot
      if (shortestDiff < nearestSlot.difference)
        nearestSlot = {
          difference: shortestDiff,
          isStart: isStartNearest,
          slot: slot,
        };
    }

    // Calculate best start for alternate event
    if (nearestSlot.slot == undefined) {
      // No available time problem
      alternate.problem = true;
      alternate.start = idealTime;
    } else if (nearestSlot.isStart) {
      alternate.start = nearestSlot.slot!.start;
    } else {
      alternate.start = UtilDate.addTime(
        nearestSlot.slot!.end,
        habit.duration * UtilDate.TIME.ONE_MINUTE * -1
      );
    }

    return alternate;
  }

  /**
   * Get a single array of events and habits.
   * This contains normal {@link Event Events}, {@link Habit Habits} and {@link HabitEvent HabitEvents}.
   * @returns Array of events
   */
  getEvents(): Event[] {
    const list: Event[] = [];
    for (const event of this._events) {
      if (UtilDate.isSameDay(event.start, event.end)) {
        event.allDay = false;
        if (event.repeat == undefined) event.draggable = true;
      } else {
        event.allDay = true;
      }
      event.resizable = {
        beforeStart: true,
        afterEnd: true,
      };
      for (const molecular of event.getEvents()) list.push(molecular);
    }

    for (const habit of this._habits) {
      for (const molecular of habit.getHabits()) {
        list.push(molecular);
      }
    }

    return list;
  }

  /**
   * Creates an object without recursion. (Safe for looping etc.)
   * @returns A sanitized and safe object
   */
  getSafeData(): any {
    const data = {
      events: this._events,
      habits: this._habits,
    };

    for (const habit of data.habits) {
      habit.alternateEvents = [];
    }

    for (const event of data.events) {
      event.resizable = undefined;
      event.draggable = undefined;
      event.allDay = undefined;
    }

    return data;
  }
}
