import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal, Signal, SimpleChanges } from '@angular/core';
import { CalendarService } from '../../Services/calendar.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export interface Meal {
  name: string;    // Zmieniamy na małe litery
  calories: string;
  weight: string;
  day: number;
}

export interface Training {
  Name: string;
  BurnedKcal: string;
  time: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  selectedDate: Date = new Date();
  selectedDay: number = this.selectedDate.getDate(); // Przechowywanie dnia

  // Sygnały na treningi i posiłki
  trainings = signal<{ [key: number]: { name: string; burnedKcal: string; time: string }[] }>({});
  meals = signal<{ [key: number]: { name: string; calories: string; weight: string }[] }>({});

  private calendarService = inject(CalendarService);
  private afAuth = inject(AngularFireAuth);

  // Observable do pobierania treningów i posiłków
  trainings$ = this.calendarService.getTrainings();
  meals$ = this.calendarService.getMeals();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["selectedDate"]) {
      console.log('Zmiana daty', changes["selectedDate"].currentValue);
    }
  }

  // Zmiana miesiąca
  changeMonth(increment: number): void {
    const currentMonth = this.selectedDate.getMonth();
    const currentDay = this.selectedDate.getDate();
    this.selectedDate.setMonth(currentMonth + increment); // Zmiana miesiąca

    // Przywracamy dzień po zmianie miesiąca
    this.selectedDate.setDate(this.selectedDay); // Ustawiamy poprzedni dzień

    // Ręczne wywołanie wykrywania zmian
    this.selectedDate = new Date(this.selectedDate);  // Zaktualizowanie referencji, żeby Angular zauważył zmianę
    this.loadTrainingsData();  // Przeładuj treningi i posiłki przy zmianie miesiąca
    this.loadMealsData();
  }

  // Generowanie dni w miesiącu
  daysInMonth(): number[] {
    const days: number[] = [];
    const date = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1);
    const lastDay = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0).getDate();

    for (let day = 1; day <= lastDay; day++) {
      days.push(day); // Dodaj dni miesiąca
    }

    return days;
  }

  // Metoda do dodawania treningu
  addTraining(day: number): void {
    const name = prompt('Podaj nazwę treningu:');
    const burnedKcal = prompt('Podaj liczbę spalonych kalorii:');
    const time = prompt('Podaj czas trwania treningu:');

    if (name && burnedKcal && time) {
      // Wywołanie metody w serwisie (zakładając, że nie zwraca Promise)
      this.calendarService.addTraining(day, name, burnedKcal, time);
      console.log('Dodano trening');
      this.loadTrainingsData(); // Ładowanie danych po dodaniu treningu
    }
  }

  // Metoda do dodawania posiłku
  addMeal(day: number): void {
    const name = prompt('Podaj nazwę posiłku:');
    const calories = prompt('Podaj liczbę kalorii:');
    const weight = prompt('Podaj wagę posiłku:');

    if (name && calories && weight) {
      // Wywołanie metody w serwisie (zakładając, że nie zwraca Promise)
      this.calendarService.addMeal(day, name, calories, weight);
      console.log('Dodano posiłek');
      this.loadMealsData(); // Ładowanie danych po dodaniu posiłku
    }
  }

  // Ładowanie treningów z Firebase
  loadTrainingsData(): void {
    this.trainings$.subscribe(trainings => {
      const updatedTrainings: { [key: number]: { name: string; burnedKcal: string; time: string }[] } = {};
  
      trainings.forEach((training: any) => {
        const day = training.day;
        if (!updatedTrainings[day]) {
          updatedTrainings[day] = [];
        }
        updatedTrainings[day].push({
          name: training.Name,
          burnedKcal: training['Burned kcal'], // Zmieniamy na 'Burden kcal'
          time: training.time
        });
      });
  
      // Zaktualizuj stan sygnału treningów
      this.trainings.set(updatedTrainings);
    });
  }
  // Ładowanie posiłków z Firebase
  loadMealsData(): void {
    this.meals$.subscribe(meals => {
      const updatedMeals: { [key: number]: Meal[] } = {}; // Używamy Meal[]
  
      meals.forEach((meal: any) => {
        const day = meal.day;
        if (!updatedMeals[day]) {
          updatedMeals[day] = []; // Tworzymy nową tablicę, jeśli nie istnieje
        }
  
        // Sprawdzamy, czy posiłek o tej samej nazwie już istnieje, aby uniknąć duplikatów
        const existingMeal = updatedMeals[day].find((m: Meal) => 
          m.name === meal.Name && m.calories === meal.calories && m.weight === meal.weight // Zmieniamy na 'name'
        );
  
        if (!existingMeal) {
          updatedMeals[day].push({
            name: meal.Name,  // Zmieniamy 'Name' na 'name'
            calories: meal.calories,
            weight: meal.weight,
            day: meal.day,
          });
        }
      });
  
      // Zaktualizuj stan sygnału posiłków
      this.meals.set(updatedMeals);
    });
  }
}