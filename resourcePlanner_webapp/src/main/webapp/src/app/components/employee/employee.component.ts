import {Component, OnInit} from '@angular/core';
import {Employee} from "../../models/employee";
import {Employment} from "../../models/employment";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  displayedColumns: string[] = ['firstName', 'lastName', 'department', 'team' ,'kostenstelle', 'employment'];

  constructor() { }

  employees: Employee[] = [{
    firstName: 'Martin',
    lastName: 'Gabel',
    department: 'Projektsteuerung',
    id: '1',
    team: 'team',
    kostenstelle: 11115004,
    employment: Employment.VOLLZEIT
  },
    {

      firstName: 'Fabian',
      lastName: 'Ziegler',
      department: 'Projektsteuerung',
      id: '2',
      team: 'team',
      kostenstelle: 11115004,
      employment: Employment.VOLLZEIT
    },

    {
      firstName: 'Christiane',
      lastName: 'Pooten',
      department: 'Projektsteuerung',
      id: '3',
      team: 'team',
      kostenstelle: 11115004,
      employment: Employment.VOLLZEIT
    },
    {
      firstName: 'Sandra',
      lastName: 'Roth',
      department: 'Projektsteuerung',
      id: '4',
      team: 'team',
      kostenstelle: 11115004,
      employment: Employment.TEILZEIT
    },
    {
      firstName: 'Oliver',
      lastName: 'Saar',
      department: 'Personalentwicklung',
      id: '5',
      team: 'Studis',
      kostenstelle: 11111111,
      employment: Employment.VOLLZEIT
    }
  ]

  ngOnInit(): void {
  }

}
