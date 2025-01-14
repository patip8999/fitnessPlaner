import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calorie-calculator',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './calorie-calculator.component.html',
  styleUrl: './calorie-calculator.component.css'
})
export class CalorieCalculatorComponent {
  calorieData = {
    gender: 'male',
    age: 25,
    height: 170,
    weight: 70,
    activityLevel: 1.2,
    tdee: 0
  };

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {}

  calculateCalories(): void {
    const { gender, age, height, weight, activityLevel } = this.calorieData;

    // Obliczenie BMR
    const bmr =
      gender === 'male'
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    // Obliczenie TDEE
    this.calorieData.tdee = bmr * activityLevel;

    // Zapis wyniku w Firebase
    this.auth.currentUser.then((user) => {
      if (user) {
        this.firestore
          .collection('calorie-calculations')
          .add({
            ...this.calorieData,
            uid: user.uid,
            date: new Date().toISOString()
          })
          .then(() => console.log('Calorie calculation saved'))
          .catch((err) => console.error('Error saving calorie calculation:', err));
      } else {
        console.error('User not authenticated');
      }
    });
  }

}
