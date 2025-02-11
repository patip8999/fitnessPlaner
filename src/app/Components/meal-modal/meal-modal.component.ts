import { Component, inject, signal } from '@angular/core';
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
  meals = signal<any[]>([]);

  model = signal<mealModel> ( {
    name: '',
    uid: '',
    calories: 0,
    weight: '',
    day: 0,
    date: new Date(),
    id: '',
    imageUrl: '',
  });

  addMeal(meal: any): void {
    
    this.trainingAndMealService.addMeal(meal);
    this.meals.update((meals) => [...meals, meal]);
    console.log('Meal added:', meal);
    this.resetForm();
  }

  onDateChange(date: string): void {
    this.model.update((currentModel) => ({
      ...currentModel,
      date: new Date(date + 'T00:00:00'),
    }));
  }
 
  resetForm(): void {
    this.model.set({
      name: '',
      calories: 0,
      weight: '',
      day: 0,
      date: new Date(),
      id: '',
      uid: '',
      imageUrl: '',
    });
  }
}
