import { Component, inject } from '@angular/core';
import { CalendarService } from '../../Services/calendar.service';

import { Meal } from '../calendar/calendar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meal-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './meal-modal.component.html',
  styleUrl: './meal-modal.component.css'
})
export class MealModalComponent {
calendarService: CalendarService = inject(CalendarService);
meals: any[] =[];

model: Meal ={
  name:'',
  
  calories: '',
  weight: '',
  day: 0,
  date: new Date(),
  id: '',
};

addMeal(day: number, name: string, calories: string, weight: string, date: Date): void {
  // Wywołanie metody z serwisu i przekazanie wymaganych argumentów
  this.calendarService.addMeal(day, name, calories, weight, date);

  // Opcjonalnie, możesz dodać aktualizację widoku w komponencie, np.:
  this.meals.push({
    day,
    name,
    calories,
    weight,
    date,
    id: '', // Możesz pozostawić pusty, jeśli identyfikator jest generowany w bazie
  });

  console.log('Meal added:', { day, name, calories, weight, date });
}
onDateChange(date: string): void {
  // Konwertuj ciąg daty na instancję Date
  this.model.date = new Date(date + 'T00:00:00');
}

}
