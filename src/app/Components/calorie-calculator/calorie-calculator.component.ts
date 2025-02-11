import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalorieService } from '../../Services/calorie.service';

@Component({
  selector: 'app-calorie-calculator',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './calorie-calculator.component.html',
  styleUrl: './calorie-calculator.component.css',
})
export class CalorieCalculatorComponent {
  private calorieService: CalorieService = inject(CalorieService);
  @Output() public tdeeCalculated = new EventEmitter<number>();
  public calorieData = {
    gender: 'male',
    age: 25,
    height: 170,
    weight: 70,
    activityLevel: 1.2,
    tdee: 0,
  };

  public ngOnInit(): void {
    this.loadTdeeFromFirebase();
  }

  public calculateCalories(): void {
    const { gender, age, height, weight, activityLevel } = this.calorieData;

    const bmr =
      gender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    this.calorieData.tdee = bmr * activityLevel;
    console.log('TDEE:', this.calorieData.tdee);

    this.tdeeCalculated.emit(this.calorieData.tdee);

    this.saveTdeeToFirebase();
  }

  private saveTdeeToFirebase(): void {
    this.calorieService.saveTdee(this.calorieData).catch((err) => {
      console.error('Error saving calorie calculation:', err);
    });
  }

  private loadTdeeFromFirebase(): void {
    this.calorieService.loadTdee().subscribe(
      (data) => {
        if (data) {
          this.calorieData.tdee = data.tdee;
          console.log('Pobrano TDEE z Firebase:', this.calorieData.tdee);
        } else {
          console.log('Brak danych o TDEE w Firebase');
        }
      },
      (err) => {
        console.error('Błąd ładowania TDEE:', err);
      }
    );
  }
}
