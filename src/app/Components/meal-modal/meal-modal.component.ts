import { Component, inject } from '@angular/core';
import { CalendarService } from '../../Services/calendar.service';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { mealModel } from '../../Models/meal.model';

@Component({
  selector: 'app-meal-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './meal-modal.component.html',
  styleUrl: './meal-modal.component.css',
})
export class MealModalComponent {
  calendarService: CalendarService = inject(CalendarService);
  meals: any[] = [];

  model: mealModel = {
    name: '',

    calories: 0,
    weight: '',
    day: 0,
    date: new Date(),
    id: '',
  };

  addMeal(meal: mealModel): void {
    // Dodanie posiłku do usługi calendarService
    this.calendarService.addMeal(meal);

    // Dodanie posiłku do lokalnej tablicy meals
    this.meals.push(meal);

    console.log('Meal added:', meal);
  }

  onDateChange(date: string): void {
    this.model.date = new Date(date + 'T00:00:00');
  }
}
