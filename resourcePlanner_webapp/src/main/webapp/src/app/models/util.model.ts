export namespace UtilObject {
  /**
   * Parse an Object Array into the specified Class Array
   * @param clazz The Class to cast into
   * @param arr The Array to cast
   * @returns Casted Array
   */
  export function parseArray(
    clazz: { new (...args: any): any },
    arr: any[]
  ): any[] {
    const eventArr: typeof clazz[] = [];
    if (Array.isArray(arr)) {
      for (const entry of arr) eventArr.push(new clazz(entry));
    }
    return eventArr;
  }

  /**
   * Compares two Objects based on their values.
   * @param obj1 Object1
   * @param obj2 Obect2
   * @returns `true` if every Value and Attribute are equal based on their content.
   */
  export function equals(obj1: any, obj2: any): boolean {
    if (obj1 == undefined || obj2 == undefined) return obj1 == obj2;
    for (const key of Object.keys(obj1)) {
      if (typeof obj1[key] === 'object') {
        if (!equals(obj1[key], obj2[key])) return false;
      }
      if (obj1[key] != obj2[key]) return false;
    }
    return true;
  }
}

export namespace UtilDate {
  /**
   * Add number of miliseconds to an Date
   * @param date Start Date
   * @param mili Number of miliseconds
   * @returns A new Date with added miliseconds
   */
  export function addTime(date: Date, mili: number): Date {
    const newDate: Date = new Date(date);
    newDate.setTime(newDate.getTime() + mili);
    return newDate;
  }

  /**
   * Add number of days to an Date
   * @param date Start Date
   * @param days Number of days
   * @returns A new Date with added days
   */
  export function addDays(date: Date, days: number): Date {
    const newDate: Date = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  /**
   * Add number of weeks to an Date
   * @param date Start Date
   * @param weeks Number of weeks
   * @returns A new Date with added weeks
   */
  export function addWeeks(date: Date, weeks: number): Date {
    const newDate: Date = new Date(date);
    newDate.setDate(newDate.getDate() + weeks * 7);
    return newDate;
  }

  /**
   * Get the difference in days between two Dates
   * @param date1 Date 1
   * @param date2 Date 2
   * @returns Number of days
   */
  export function diffTime(
    date1: Date,
    date2: Date,
    multiplier?: number
  ): number {
    if (multiplier == undefined) multiplier = 1;
    const differenceMs = Math.abs(date1.getTime() - date2.getTime());
    return Math.round(differenceMs / multiplier);
  }

  export function setDayTime(dateToChange: Date, timeToSet: Date): Date {
    const date = new Date(dateToChange);
    date.setHours(timeToSet.getHours());
    date.setMinutes(timeToSet.getMinutes());
    date.setSeconds(timeToSet.getSeconds());
    return date;
  }

  /**
   * Check if two timespans overlap
   * @param date1Start Start date of first timespan
   * @param date1End End date of first timespan
   * @param date2Start Start date of second timespan
   * @param date2End End dte of secong timespan
   * @returns `true` if they overlap
   */
  export function isOverlapping(
    date1Start: Date,
    date1End: Date,
    date2Start: Date,
    date2End: Date
  ): boolean {
    return (
      date1Start.getTime() <= date2End.getTime() &&
      date2Start.getTime() <= date1End.getTime()
    );
  }

  /**
   * Check if two dates are the same day
   * @param date1 First date
   * @param date2 Second date
   * @returns `true` if dates are the same day
   */
  export function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    );
  }

  /**
   * Check if a date is between a timespan
   * @param checkDate Date to check
   * @param startDate Start date of timespan
   * @param endDate End date of timespa
   * @returns `true` if it is completely inside the timespan
   */
  export function isBetweenTimespan(
    checkDate: Date,
    startDate: Date,
    endDate: Date
  ): boolean {
    return (
      startDate.getTime() < checkDate.getTime() &&
      endDate.getTime() > checkDate.getTime()
    );
  }

  /**
   * Calculate available time between two dates
   * @param date1 First date
   * @param date2 Second date
   * @returns A time slot element with duration
   */
  export function calculateTimeSlot(
    date1: Date,
    date2: Date
  ): { start: Date; end: Date; duration: number } {
    const slot = {
      start: date1.getTime() > date2.getTime() ? date2 : date1,
      end: date1.getTime() < date2.getTime() ? date2 : date1,
      duration: UtilDate.diffTime(date1, date2),
    };
    return slot;
  }

  /**
   * Enum for date days
   */
  export enum DAY {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
  }

  /**
   * Get a days translated name
   * @param day Day to get name from
   * @returns A string with translated name
   */
  export function getDayName(day: DAY): string {
    switch (day) {
      case DAY.SUNDAY:
        return 'Sonntag';
      case DAY.MONDAY:
        return 'Montag';
      case DAY.TUESDAY:
        return 'Dienstag';
      case DAY.WEDNESDAY:
        return 'Mittwoch';
      case DAY.THURSDAY:
        return 'Donnerstag';
      case DAY.FRIDAY:
        return 'Freitag';
      case DAY.SATURDAY:
        return 'Samstag';
    }
  }

  /**
   * Get a list of transformed days
   * @returns A list of days with translated names and indices
   */
  export function getDays(): { name: string; index: number }[] {
    const list: { name: string; index: number }[] = [];

    for (const day in DAY) {
      var isIndex = Number(day) >= 0;
      if (!isIndex) {
        list.push({
          name: getDayName(DAY[day] as any),
          index: Object.keys(DAY).indexOf(DAY[day].toString()),
        });
      }
    }

    return list;
  }

  /**
   * Enum for time constants
   */
  export enum TIME {
    ONE_SECOND = 1000,
    ONE_MINUTE = ONE_SECOND * 60,
    ONE_HOUR = ONE_MINUTE * 60,
    ONE_DAY = ONE_HOUR * 24,
    ONE_WEEK = ONE_DAY * 7,
  }
}
