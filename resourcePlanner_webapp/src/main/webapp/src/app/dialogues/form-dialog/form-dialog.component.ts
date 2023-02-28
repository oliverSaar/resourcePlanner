import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Event } from 'src/app/models/event.model';
import { Habit } from 'src/app/models/habit.model';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
})
export class FormDialogComponent implements OnInit {
  @ViewChild(FormComponent)
  set comp(v: FormComponent) {
    v.initializeControls();
  }

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isHabit: boolean;
      isEditMode: boolean;
      event: Event | Habit;
      refresh?: any;
    }
  ) {}

  ngOnInit(): void {}
}
