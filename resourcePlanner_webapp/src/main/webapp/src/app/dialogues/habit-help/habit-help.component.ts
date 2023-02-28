import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-habit-help',
  templateUrl: './habit-help.component.html',
  styleUrls: ['./habit-help.component.scss'],
})
export class HabitHelpComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<HabitHelpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
