import { Event } from './event.model';

export class HabitEvent extends Event {
  /**
   * If a something is interfering with this event
   */
  problem?: boolean;

  constructor(obj: any) {
    super(obj);

    this.problem = obj.problem ? obj.problem : undefined;
  }
}
