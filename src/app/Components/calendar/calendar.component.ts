import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal, Signal, SimpleChanges } from '@angular/core';
import { CalendarService } from '../../Services/calendar.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export interface Meal {
  name: string;  
  calories: string;
  weight: string;
  day: number;
  date: Date;
  id: string;
}

export interface Training {
  name: string;
  burnedKcal: string;
  time: string;
  date: Date;
  id: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  private calendarService = inject(CalendarService);
  private datePipe = inject(DatePipe);
  today = new Date().getDate(); // Dodana właściwość
  meals = signal<Meal[]>([]);
  trainings = signal<Training[]>([]);

  days = Array.from({ length: 31 }, (_, i) => i + 1);

  constructor() {
    this.loadData();
  }

  loadData() {
    // Pobieranie treningów
    this.calendarService.getTrainings().subscribe(trainings => {
      const parsedTrainings = trainings.map((training, index) => ({
        ...training,
        id: training.id || `training-${index}`, // Generowanie unikalnego identyfikatora
        date: new Date(training.date), // Parsowanie daty
      }));
      this.trainings.set(parsedTrainings);
    });
  
    // Pobieranie posiłków
    this.calendarService.getMeals().subscribe(meals => {
      const parsedMeals = meals.map((meal, index) => ({
        ...meal,
        id: meal.id || `meal-${index}`, // Generowanie unikalnego identyfikatora
        date: new Date(meal.date), // Parsowanie daty
      }));
      this.meals.set(parsedMeals);
    });
  }
  addMeal(day: number) {
    const name = prompt('Podaj nazwę posiłku:');
    const calories = prompt('Podaj liczbę kalorii:');
    const weight = prompt('Podaj wagę posiłku:');
    const dateInput = prompt('Podaj datę w formacie YYYY-MM-DD:');
    const date = dateInput ? new Date(dateInput) : null;
  
    if (name && calories && weight && date) {
      this.calendarService.addMeal(day, name, calories, weight, date);
      this.loadData();
    } else {
      alert('Nieprawidłowe dane. Upewnij się, że wszystkie pola są wypełnione.');
    }
  }
  
  addTraining(day: number) {
    const name = prompt('Podaj nazwę treningu:');
    const burnedKcal = prompt('Podaj spalone kalorie:');
    const time = prompt('Podaj czas trwania treningu:');
    const dateInput = prompt('Podaj datę w formacie YYYY-MM-DD:');
    const date = dateInput ? new Date(dateInput) : null;
  
    if (name && burnedKcal && time && date) {
      this.calendarService.addTraining(day, name, burnedKcal, time, date);
      this.loadData();
    } else {
      alert('Nieprawidłowe dane. Upewnij się, że wszystkie pola są wypełnione.');
    }
  }

  getMealsForDay(day: number): Meal[] {
    return this.meals().filter(meal => {
 
      return meal.date.getDate() === day;
    });
  }
  
  getTrainingsForDay(day: number): Training[] {
    return this.trainings().filter(training => {
      return training.date.getDate() === day; // `date` jest teraz obiektem `Date`
    });
  }
}
