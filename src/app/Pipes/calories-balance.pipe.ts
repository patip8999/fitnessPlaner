import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'caloriesBalance',
  standalone: true,
})
export class CaloriesBalancePipe implements PipeTransform {
  transform(meals: any[], trainings: any[], tdee: number): number {
    const totalMealsCalories = meals.reduce(
      (acc, meal) => acc + (meal.calories || 0),
      0
    );

    const totalBurnedCalories = trainings.reduce(
      (acc, training) => acc + (training.burnedKcal || 0),
      0
    );

    return tdee - totalMealsCalories + totalBurnedCalories;
  }
}
