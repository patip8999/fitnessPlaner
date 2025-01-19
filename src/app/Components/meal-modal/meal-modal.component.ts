import { Component, inject } from '@angular/core';
import { TrainingAndMealService } from '../../Services/calendar.service';
import { FormsModule } from '@angular/forms';
import { mealModel } from '../../Models/meal.model';
import { ModalComponent } from '../UI/modal/modal.component';

@Component({
  selector: 'app-meal-modal',
  standalone: true,
  imports: [FormsModule,  ModalComponent],
  templateUrl: './meal-modal.component.html',
  styleUrl: './meal-modal.component.css',
})
export class MealModalComponent {
  trainingAndMealService: TrainingAndMealService = inject(
    TrainingAndMealService
  );
  meals: any[] = [];

  model: mealModel = {
    name: '',

    calories: 0,
    weight: '',
    day: 0,
    date: new Date(),
    id: '',
  };

  addMeal(meal: any): void {
    this.trainingAndMealService.addMeal(meal);
    this.meals.push(meal);
    console.log('Meal added:', meal);
  }

  onDateChange(date: string): void {
    this.model.date = new Date(date + 'T00:00:00');
  }
}
