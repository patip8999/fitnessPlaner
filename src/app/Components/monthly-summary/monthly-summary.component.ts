import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import {  TrainingAndMealService } from '../../Services/calendar.service';
import { DatePipe } from '@angular/common';
import { TrainingModel } from '../../Models/training.model';  
import { mealModel } from '../../Models/meal.model';
@Component({
  selector: 'app-monthly-summary',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './monthly-summary.component.html',
  styleUrls: ['./monthly-summary.component.css'],
})
export class MonthlySummaryComponent {
  meals = signal<mealModel[]>([]);
  trainings = signal<TrainingModel[]>([]);
  currentMonth: Date = new Date();

  trainingAndMealService: TrainingAndMealService = inject(TrainingAndMealService);
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

    this.trainingAndMealService
      .getMealsByDateRange(startOfMonth, endOfMonth)
      .subscribe((meals) => {
        this.meals.set(meals || []);
      });

    this.trainingAndMealService
      .getTrainingsByDateRange(startOfMonth, endOfMonth)
      .subscribe((trainings) => {
        this.trainings.set(trainings || []);
      });
  }

  totalCalories(): number {
    const meals = this.meals(); 
    return meals.reduce(
      (sum, meal) => sum + (meal.calories ? Number(meal.calories) : 0),
      0
    );
  }
  
  totalBurnedCalories(): number {
    const trainings = this.trainings(); 
    return trainings.reduce(
      (sum, training) => sum + (training.burnedKcal ? Number(training.burnedKcal) : 0),
      0
    );
  }
  
  totalTrainingTime(): number {
    const trainings = this.trainings(); 
    return trainings.reduce(
      (sum, training) => sum + (training.time ? Number(training.time) : 0),
      0
    );
  }
}
