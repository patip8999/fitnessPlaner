import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { CalorieCalculation } from '../../Models/calorie-calculation.model';
import { CalorieService } from '../../Services/calorie.service';

@Component({
  selector: 'app-calorie-calculator',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './calorie-calculator.component.html',
  styleUrl: './calorie-calculator.component.css'
})
export class CalorieCalculatorComponent {
  calorieService: CalorieService = inject(CalorieService);
  @Output() tdeeCalculated = new EventEmitter<number>();
  calorieData = {
    gender: 'male',
    age: 25,
    height: 170,
    weight: 70,
    activityLevel: 1.2,
    tdee: 0,
  };

 

  ngOnInit(): void {
    this.loadTdeeFromFirebase();
  }

  // Metoda do obliczania TDEE
  calculateCalories(): void {
    const { gender, age, height, weight, activityLevel } = this.calorieData;

    // Obliczenie BMR
    const bmr =
      gender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    // Obliczenie TDEE
    this.calorieData.tdee = bmr * activityLevel;
    console.log('TDEE:', this.calorieData.tdee);

    // Emitowanie obliczonego TDEE do komponentu nadrzędnego
    this.tdeeCalculated.emit(this.calorieData.tdee);

    // Zapis wyniku w Firebase
    this.saveTdeeToFirebase();
  }

  // Metoda do zapisywania TDEE do Firebase
  private saveTdeeToFirebase(): void {
    this.calorieService.saveTdee(this.calorieData).catch((err) => {
      console.error('Error saving calorie calculation:', err);
    });
  }

  // Metoda do ładowania TDEE z Firebase
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