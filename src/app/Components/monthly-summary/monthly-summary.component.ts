import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { CalendarService } from '../../Services/calendar.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-monthly-summary',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './monthly-summary.component.html',
  styleUrl: './monthly-summary.component.css',
})
export class MonthlySummaryComponent {
  meals = signal<any[]>([]);
  trainings = signal<any[]>([]);
  currentMonth: Date = new Date();

  calendarService: CalendarService = inject(CalendarService);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  constructor() {
    this.loadMonthlyDetails();
  }

  changeMonth(offset: number): void {
    const newMonth = new Date(this.currentMonth);
    newMonth.setMonth(this.currentMonth.getMonth() + offset);
    this.currentMonth = newMonth;
    this.loadMonthlyDetails();
    this.cdr.markForCheck();
  }

  loadMonthlyDetails(): void {
    const startOfMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      0
    );

    this.calendarService
      .getMealsByDateRange(startOfMonth, endOfMonth)
      .subscribe((meals) => {
        this.meals.set(meals || []);
      });

    this.calendarService
      .getTrainingsByDateRange(startOfMonth, endOfMonth)
      .subscribe((trainings) => {
        this.trainings.set(trainings || []);
      });
  }

  totalCalories(): number {
    return this.meals().reduce(
      (sum, meal) => sum + (Number(meal.calories) || 0),
      0
    );
  }

  totalBurnedCalories(): number {
    return this.trainings().reduce(
      (sum, training) => sum + (Number(training.burnedKcal) || 0),
      0
    );
  }

  totalTrainingTime(): number {
    return this.trainings().reduce(
      (sum, training) => sum + (Number(training.time) || 0),
      0
    );
  }
}
