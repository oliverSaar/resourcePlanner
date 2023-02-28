import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitHelpComponent } from './habit-help.component';

describe('HabitHelpComponent', () => {
  let component: HabitHelpComponent;
  let fixture: ComponentFixture<HabitHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HabitHelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
