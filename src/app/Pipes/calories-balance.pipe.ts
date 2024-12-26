import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'caloriesBalance',
  standalone: true,
})
export class CaloriesBalancePipe implements PipeTransform {
  transform(meals: any[], trainings: any[]): number {
    console.log('Meals:', meals);
    console.log('Trainings:', trainings);

    const totalCalories = meals.reduce((acc, meal) => {
      const calories = parseInt(meal.calories, 10);
      console.log('Meal:', meal, 'Calories:', calories);
      return acc + (isNaN(calories) ? 0 : calories);
    }, 0);

    const totalBurnedCalories = trainings.reduce((acc, training) => {
      const burnedKcal = parseInt(training.burnedKcal, 10);
      console.log('Training:', training, 'BurnedKcal:', burnedKcal);
      return acc + (isNaN(burnedKcal) ? 0 : burnedKcal);
    }, 0);

    console.log('Total Calories:', totalCalories);
    console.log('Total Burned Calories:', totalBurnedCalories);

    return totalCalories - totalBurnedCalories;
  }
}
