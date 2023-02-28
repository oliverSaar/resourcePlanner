import { CalendarEvent } from 'angular-calendar';
import { Habit } from './habit.model';
import { UtilDate } from './util.model';

export class Event implements CalendarEvent {
  /**
   * Title of this event
   */
  title: string;

  /**
   * Description of this event
   */
  description?: string;

  /**
   * Color object with `primary` and `secondary` color
   */
  color: {
    primary: string;
    secondary: string;
  };

  /**
   * Start of this event
   */
  start: Date;

  /**
   * End of this event
   */
  end: Date;

  /**
   * Repeating Days and how often/long
   */
  repeat?: {
    days: UtilDate.DAY[];
    repeating: Date | number;
  };

  /**
   * TODO: Position
   * ```js
   * {
   *  name?: string,
   *  lat: string,
   *  lng: string
   * }
   * ```
   */
  position?: any;

  /**
   * (CalendarEvent interface) All Day
   */
  allDay?: boolean;

  /**
   * (CalendarEvent interface) Draggable
   */
  draggable?: boolean;

  /**
   * (CalendarEvent interface) Resizable
   */
  resizable?: {
    beforeStart?: boolean;
    afterEnd?: boolean;
  };

  /**
   * If this is a reference of an other Event
   * (Generated through repeating etc.)
   */
  reference?: Event | Habit;

  constructor(obj: any) {
    this.start = obj.start ? new Date(obj.start) : new Date();
    this.end = obj.end ? new Date(obj.end) : new Date();

    this.title = obj.title ? obj.title : '';
    this.description = obj.description ? obj.description : undefined;

    this.color = {
      primary: obj.color && obj.color.primary ? obj.color.primary : '#009688',
      secondary:
        obj.color && obj.color.secondary ? obj.color.secondary : '#ffffff',
    };

    if (obj.repeat) {
      this.repeat = {
        days: obj.repeat.days ? obj.repeat.days : [0],
        repeating: obj.repeat.repeating
          ? typeof obj.repeat.repeating == 'number'
            ? obj.repeat.repeating
            : new Date(obj.repeat.repeating)
          : 1,
      };
    }

    this.allDay = obj.allDay ? obj.allDay : undefined;
    this.draggable = obj.draggable ? obj.draggable : undefined;
    if (obj.resizable) {
      this.resizable = {
        beforeStart: obj.resizable.beforeStart
          ? obj.resizable.beforeStart
          : undefined,
        afterEnd: obj.resizable.afterEnd ? obj.resizable.afterEnd : undefined,
      };
    }

    this.reference = obj.reference ? obj.reference : undefined;
  }

  /**
   * If `repeating` is set, then it will return molecular Event items.
   * @returns Generated Event list
   */
  getEvents(): Event[] {
    // Check if it repeats and is no child
    if (this.repeat == undefined || this.reference) {
      return [new Event({ ...this, reference: this })];
    }

    let repeating = this.repeat.repeating;

    // Check if repeating is number of weeks. If yes, convert to Date
    if (typeof repeating === 'number') {
      repeating = UtilDate.addWeeks(this.start, repeating);
      repeating = UtilDate.addDays(repeating, -1);
    }

    // Iterate through the amount of days to repeat
    const arr: Event[] = [];
    const days = UtilDate.diffTime(
      this.start,
      repeating,
      UtilDate.TIME.ONE_DAY
    );
    for (let i = 0; i <= days; i++) {
      // Check if Day is in repeating defined
      const current = UtilDate.addDays(this.start, i);
      if (this.repeat.days.includes(current.getDay())) {
        // Create new Date
        const newEvent: Event = new Event(this);
        newEvent.reference = this;
        newEvent.repeat = undefined;

        // Set to new Date
        const diffTime = UtilDate.diffTime(this.start, this.end, 1);
        newEvent.start = current;
        newEvent.end = UtilDate.addTime(current, diffTime);

        // Add to list
        arr.push(newEvent);
      }
    }

    return arr;
  }
}
