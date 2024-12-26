import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CalendarService } from '../../Services/calendar.service';

import { MealModalComponent } from '../meal-modal/meal-modal.component';
import { RouterModule } from '@angular/router';
import { TrainingModalComponent } from '../training-modal/training-modal.component';
import { mealModel } from '../../Models/meal.model';
import { TrainingModel } from '../../Models/training.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MealModalComponent,
    RouterModule,
    TrainingModalComponent,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  private calendarService = inject(CalendarService);

  today: number = new Date().getDate();
  meals: WritableSignal<mealModel[]> = signal<mealModel[]>([]);
  trainings: WritableSignal<TrainingModel[]> = signal<TrainingModel[]>([]);
  calendarDays: { date: Date; isOtherMonth: boolean }[] = [];
  readonly days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  readonly currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  constructor() {
    this.loadData();
    this.generateCalendar();
  }

  private loadData(): void {
    this.calendarService.getTrainings().subscribe((trainings) => {
      const parsedTrainings = trainings.map((training, index) => ({
        ...training,
        id: training.id || `training-${index}`,
        date: new Date(training.date),
      }));
      this.trainings.set(parsedTrainings);
    });

    this.calendarService.getMeals().subscribe((meals) => {
      const parsedMeals = meals.map((meal, index) => ({
        ...meal,
        id: meal.id || `meal-${index}`,
        date: new Date(meal.date),
      }));
      this.meals.set(parsedMeals);
    });
  }

  getMealsForDay(date: Date): mealModel[] {
    return this.meals().filter((meal) => {
      return (
        meal.date.getDate() === date.getDate() &&
        meal.date.getMonth() === date.getMonth() &&
        meal.date.getFullYear() === date.getFullYear()
      );
    });
  }

  getTrainingsForDay(date: Date): TrainingModel[] {
    return this.trainings().filter((training) => {
      return (
        training.date.getDate() === date.getDate() &&
        training.date.getMonth() === date.getMonth() &&
        training.date.getFullYear() === date.getFullYear()
      );
    });
  }

  readonly dayNames: string[] = ['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb', 'Nd'];
  readonly months: string[] = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ];

  private generateCalendar(): void {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const firstDayWeekday = firstDayOfMonth.getDay() || 7;
    const daysFromPrevMonth = firstDayWeekday - 1;

    const lastDayWeekday = lastDayOfMonth.getDay() || 7;
    const daysFromNextMonth = 7 - lastDayWeekday;

    this.calendarDays = [];

    for (let i = daysFromPrevMonth; i > 0; i--) {
      const date = new Date(this.currentYear, this.currentMonth, -i + 1);
      this.calendarDays.push({ date, isOtherMonth: true });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      this.calendarDays.push({ date, isOtherMonth: false });
    }

    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(this.currentYear, this.currentMonth + 1, i);
      this.calendarDays.push({ date, isOtherMonth: true });
    }
  }

  prevMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }
}
