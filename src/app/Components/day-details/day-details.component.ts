import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarService } from '../../Services/calendar.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-day-details',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './day-details.component.html',
  styleUrl: './day-details.component.css'
})
export class DayDetailsComponent {
  day = signal<Date | null>(null);
  meals = signal<any[]>([]);
  trainings = signal<any[]>([]);

  route: ActivatedRoute = inject(ActivatedRoute);
  calendarService: CalendarService = inject(CalendarService);

  constructor() {
    // Odczytujemy parametr 'day' z URL
    this.route.paramMap.subscribe(params => {
      const dayParam = params.get('day'); // 'day' to parametr w URL
      console.log('Dzień z parametru URL:', dayParam); // Debugowanie

      if (dayParam) {
        const day = new Date(dayParam);
        this.day.set(day); // Używamy sygnału do ustawiania daty
        this.loadDetails(day); // Ładujemy dane
      }
    });
  }

  loadDetails(day: Date): void {
    // Ładowanie danych po dacie
    this.calendarService.getMealsByDate(day).subscribe(meals => {
      console.log('Pobrane posiłki:', meals); // Dodaj logowanie
      this.meals.set(meals); // Używamy sygnału do zapisania posiłków
    });
  
    this.calendarService.getTrainingsByDate(day).subscribe(trainings => {
      console.log('Pobrane treningi:', trainings); // Dodaj logowanie
      this.trainings.set(trainings); // Używamy sygnału do zapisania treningów
    });
  }
}