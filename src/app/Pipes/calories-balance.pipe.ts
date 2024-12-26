import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'caloriesBalance',
  standalone: true
})
export class CaloriesBalancePipe implements PipeTransform {
  transform(meals: any[], trainings: any[]): number {
    console.log('Meals:', meals); // Debugging meals data
    console.log('Trainings:', trainings); // Debugging trainings data
    
    // Suma kalorii z posiłków
    const totalCalories = meals.reduce((acc, meal) => {
      const calories = parseInt(meal.calories, 10); // Parsowanie na liczbę
      console.log('Meal:', meal, 'Calories:', calories); // Log meal and its calories
      return acc + (isNaN(calories) ? 0 : calories); // Dodajemy tylko, jeśli calories jest liczbą
    }, 0);

    // Suma spalonych kalorii z treningów
    const totalBurnedCalories = trainings.reduce((acc, training) => {
      const burnedKcal = parseInt(training.burnedKcal, 10); // Parsowanie na liczbę
      console.log('Training:', training, 'BurnedKcal:', burnedKcal); // Log training and burnedKcal
      return acc + (isNaN(burnedKcal) ? 0 : burnedKcal); // Dodajemy tylko, jeśli burnedKcal jest liczbą
    }, 0);

    console.log('Total Calories:', totalCalories);
    console.log('Total Burned Calories:', totalBurnedCalories);

    return totalCalories - totalBurnedCalories;
  }
}