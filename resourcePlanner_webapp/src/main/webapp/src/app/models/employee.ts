import {Employment} from "./employment";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  team: string;
  department: string;
  employement: Employment;
  kostenstelle: number;
}
