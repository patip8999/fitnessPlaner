import { Component, inject, signal, computed, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TrainingAndMealService } from '../../Services/calendar.service';
import { QuotesService, QuoteModel } from '../../Services/quotes.service';

import localePl from '@angular/common/locales/pl';
import { mealModel } from '../../Models/meal.model';
import { TrainingModel } from '../../Models/training.model';
import { TrainingPlanModel } from '../../Models/training-plan.model';
import { MealModalComponent } from '../meal-modal/meal-modal.component';
import { TrainingModalComponent } from '../training-modal/training-modal.component';
import { EditComponent } from '../edit/edit.component';
import { EditTrainingComponent } from '../edit-training/edit-training.component';

registerLocaleData(localePl);

interface CalendarDay {
  date: Date;
  isOtherMonth: boolean;
  trainingPlans?: TrainingPlanModel[];
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DatePipe,
    MealModalComponent,
    TrainingModalComponent,
    EditComponent,
    EditTrainingComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'pl' }],
})
export class CalendarComponent {
  private readonly trainingAndMealService = inject(TrainingAndMealService);
  private readonly quotesService = inject(QuotesService);

 
  public readonly meals = signal<mealModel[]>([]);
  public readonly trainings = signal<TrainingModel[]>([]);
  public readonly calendarDays = signal<CalendarDay[]>([]);
  public readonly currentWeek = signal<CalendarDay[]>([]);
  public readonly currentDate = signal<Date>(new Date());
  public readonly currentMonth = signal<number>(this.currentDate().getMonth());
  public readonly currentYear = signal<number>(this.currentDate().getFullYear());
  public readonly selectedMeal = signal<mealModel | null>(null);
  public readonly selectedTraining = signal<TrainingModel | null>(null);
  public readonly quotes = signal<QuoteModel[]>([]);
  public readonly currentQuote = signal<QuoteModel | undefined>(undefined);
  public readonly showModal = signal(false);
  public readonly selectedDay = signal<Date | null>(null);


  public readonly dayNames = ['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb', 'Nd'];
  public readonly months = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień',
    'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

 
  public readonly weekRange = computed(() => {
    const firstDay = this.currentWeek()[0]?.date;
    const lastDay = this.currentWeek()[6]?.date;
    return firstDay && lastDay ? `${firstDay.toLocaleDateString()} - ${lastDay.toLocaleDateString()}` : '';
  });

  constructor() {
    this.loadData();
    this.generateCalendar();
    this.generateWeek(this.currentDate());
    this.rotateQuotes();
  }

  private loadData(): void {
    this.trainingAndMealService.getTrainings().subscribe((trainings) => {
      const parsedTrainings = trainings.map((training) => ({
        ...training,
        id: training.id || `training-${new Date().getTime()}`,
        date: new Date(training.date),
      }));
      this.trainings.set(parsedTrainings);
    });

    this.trainingAndMealService.getMeals().subscribe((meals) => {
      const parsedMeals = meals.map((meal) => ({
        ...meal,
        id: meal.id || `meal-${new Date().getTime()}`,
        date: new Date(meal.date),
      }));
      this.meals.set(parsedMeals);
    });

    this.quotesService.getQuotes().subscribe((quotes) => {
      this.quotes.set(quotes);
      if (quotes.length > 0) {
        this.currentQuote.set(quotes[0]);
      }
    });
  }

  private rotateQuotes(): void {
    setInterval(() => {
      const quotes = this.quotes();
      if (quotes.length > 0) {
        const currentIndex = (quotes.indexOf(this.currentQuote()!) + 1) % quotes.length;
        this.currentQuote.set(quotes[currentIndex]);
      }
    }, 10000);
  }

  private generateWeek(startDate: Date): void {
    const startOfWeek = new Date(startDate.setDate(startDate.getDate() - startDate.getDay() + 1));
    const week: CalendarDay[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push({ date, isOtherMonth: false });
    }

    this.currentWeek.set(week);
  }

  private generateCalendar(): void {
    const firstDayOfMonth = new Date(this.currentYear(), this.currentMonth(), 1);
    const lastDayOfMonth = new Date(this.currentYear(), this.currentMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const firstDayWeekday = firstDayOfMonth.getDay() || 7;
    const daysFromPrevMonth = firstDayWeekday - 1;

    const lastDayWeekday = lastDayOfMonth.getDay() || 7;
    const daysFromNextMonth = 7 - lastDayWeekday;

    const calendarDays: CalendarDay[] = [];

    for (let i = daysFromPrevMonth; i > 0; i--) {
      const date = new Date(this.currentYear(), this.currentMonth(), -i + 1);
      calendarDays.push({ date, isOtherMonth: true });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.currentYear(), this.currentMonth(), i);
      calendarDays.push({ date, isOtherMonth: false });
    }

    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(this.currentYear(), this.currentMonth() + 1, i);
      calendarDays.push({ date, isOtherMonth: true });
    }

    this.calendarDays.set(calendarDays);
  }

  public prevWeek(): void {
    const firstDayOfWeek = this.currentWeek()[0].date;
    const newStartDate = new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 7));
    this.generateWeek(newStartDate);
  }

  public nextWeek(): void {
    const lastDayOfWeek = this.currentWeek()[6].date;
    const newStartDate = new Date(lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 1));
    this.generateWeek(newStartDate);
  }

  public selectDay(date: Date): void {
    this.selectedDay.set(date);
    this.generateWeek(date);
  }

  public prevMonth(): void {
    this.currentMonth.update((month) => (month - 1 + 12) % 12);
    if (this.currentMonth() === 11) {
      this.currentYear.update((year) => year - 1);
    }
    this.generateCalendar();
  }

  public nextMonth(): void {
    this.currentMonth.update((month) => (month + 1) % 12);
    if (this.currentMonth() === 0) {
      this.currentYear.update((year) => year + 1);
    }
    this.generateCalendar();
  }

  public getMealsForDay(date: Date): mealModel[] {
    return this.meals().filter((meal) => this.isSameDay(meal.date, date));
  }

  public getTrainingsForDay(date: Date): TrainingModel[] {
    return this.trainings().filter((training) => this.isSameDay(training.date, date));
  }

  public hasEventsForDay(date: Date): boolean {
    return this.getMealsForDay(date).length > 0 || this.getTrainingsForDay(date).length > 0;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  public closeModal(): void {
    this.showModal.set(false);
  }

  public editMeal(meal: mealModel): void {
    this.selectedMeal.set({ ...meal });
  }

  public toggleTrainingDone(training: TrainingModel): void {
    const updatedTraining = { ...training, isDone: !training.isDone };
    this.saveEditedTraining(updatedTraining);
  }

  public saveEditedMeal(updatedMeal: mealModel): void {
    this.trainingAndMealService.updateMeal(updatedMeal)
      .then(() => {
        this.meals.update((meals) =>
          meals.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal))
        );
      })
      .catch((error) => {
        console.error('Error saving edited meal:', error);
        alert('Nie udało się zapisać posiłku. Spróbuj ponownie.');
      });
  }

  public deleteMeal(mealId: string): void {
    this.trainingAndMealService.deleteMeal(mealId)
      .then(() => {
        this.meals.update((meals) => meals.filter((meal) => meal.id !== mealId));
      })
      .catch((error) => {
        console.error('Error deleting meal:', error);
        alert('Nie udało się usunąć posiłku. Spróbuj ponownie.');
      });
  }

  public editTraining(training: TrainingModel): void {
    this.selectedTraining.set({ ...training });
  }

  public saveEditedTraining(updatedTraining: TrainingModel): void {
    this.trainingAndMealService.updateTraining(updatedTraining)
      .then(() => {
        this.trainings.update((trainings) =>
          trainings.map((training) => (training.id === updatedTraining.id ? updatedTraining : training))
        );
      })
      .catch((error) => {
        console.error('Error saving edited training:', error);
        alert('Nie udało się zapisać treningu. Spróbuj ponownie.');
      });
  }

  public deleteTraining(trainingId: string): void {
    this.trainingAndMealService.deleteTraining(trainingId)
      .then(() => {
        this.trainings.update((trainings) => trainings.filter((training) => training.id !== trainingId));
      })
      .catch((error) => {
        console.error('Error deleting training:', error);
        alert('Nie udało się usunąć treningu. Spróbuj ponownie.');
      });
  }
}