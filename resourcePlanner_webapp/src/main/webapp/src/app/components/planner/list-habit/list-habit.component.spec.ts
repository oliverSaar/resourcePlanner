import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHabitComponent } from './list-habit.component';

describe('ListHabitComponent', () => {
  let component: ListHabitComponent;
  let fixture: ComponentFixture<ListHabitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListHabitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
