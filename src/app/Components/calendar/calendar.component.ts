import { CommonModule, registerLocaleData } from '@angular/common';
import {
  Component,
  inject,
  LOCALE_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { TrainingAndMealService } from '../../Services/calendar.service';
import localePl from '@angular/common/locales/pl';
import { MealModalComponent } from '../meal-modal/meal-modal.component';
import { RouterModule } from '@angular/router';
import { TrainingModalComponent } from '../training-modal/training-modal.component';
import { mealModel } from '../../Models/meal.model';
import { TrainingModel } from '../../Models/training.model';
import { EditComponent } from '../edit/edit.component';
import { EditTrainingComponent } from '../edit-training/edit-training.component';
import { TrainingPlanModel } from '../../Models/training-plan.model';
import { FormsModule } from '@angular/forms';
import { QuoteModel, QuotesService } from '../../Services/quotes.service';

interface CalendarDay {
  date: Date;
  isOtherMonth: boolean;
  trainingPlans?: TrainingPlanModel[];
}

registerLocaleData(localePl);

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MealModalComponent,
    RouterModule,
    TrainingModalComponent,
    EditComponent,
    EditTrainingComponent,
    FormsModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'pl' }],
})
export class CalendarComponent {
  private readonly TrainingAndMealService = inject(TrainingAndMealService);
  private readonly quotesService = inject(QuotesService);

 
  public readonly meals: WritableSignal<mealModel[]> = signal<mealModel[]>([]);
  public readonly trainings: WritableSignal<TrainingModel[]> = signal<TrainingModel[]>([]);


  public calendarDays: CalendarDay[] = [];
  public currentWeek: CalendarDay[] = [];
  public readonly currentDate: Date = new Date();
  public currentMonth: number = this.currentDate.getMonth();
  public currentYear: number = this.currentDate.getFullYear();


  public selectedMeal: mealModel | null = null;
  public selectedTraining: TrainingModel | null = null;


  public quotes: QuoteModel[] = [];
  public currentQuote: QuoteModel | undefined;
  private currentIndex = 0;


  public readonly showModal = signal(false);


  public selectedDay: Date | null = null;

 
  public readonly dayNames: string[] = ['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb', 'Nd'];
  public readonly months: string[] = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 
    'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  constructor() {
    this.loadData();
    this.generateCalendar();
    this.generateWeek(new Date());
  }


  private loadData(): void {
    this.TrainingAndMealService.getTrainings().subscribe((trainings) => {
      const parsedTrainings = trainings.map((training, index) => ({
        ...training,
        id: training.id || `training-${index}-${new Date().getTime()}`,
        date: new Date(training.date),
      }));
      this.trainings.set(parsedTrainings);

      this.quotesService.getQuotes().subscribe((quotes) => {
        this.quotes = quotes;
        if (this.quotes.length > 0) {
          this.currentQuote = this.quotes[0];
        }
        this.rotateQuotes();
      });
    });

    this.TrainingAndMealService.getMeals().subscribe((meals) => {
      const parsedMeals = meals.map((meal, index) => ({
        ...meal,
        id: meal.id || `meal-${index}-${new Date().getTime()}`,
        date: new Date(meal.date),
      }));
      this.meals.set(parsedMeals);
    });
  }

  private rotateQuotes(): void {
    setInterval(() => {
      if (this.quotes.length > 0) {
        this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
        this.currentQuote = this.quotes[this.currentIndex];
      }
    }, 10000);
  }

  private generateWeek(startDate: Date): void {
    const startOfWeek = new Date(startDate.setDate(startDate.getDate() - startDate.getDay() + 1));
    this.currentWeek = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.currentWeek.push({ date, isOtherMonth: false });
    }
  }

  private generateCalendar(): void {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    const firstDayWeekday = firstDayOfMonth.getDay() || 7;
    const daysFromPrevMonth = firstDayWeekday - 1;

    const lastDayWeekday = lastDayOfMonth.getDay() || 7;
    const daysFromNextMonth = 7 - lastDayWeekday;

    this.calendarDays = [];

    for (let i = daysFromPrevMonth; i > 0; i--) {
      const date = new Date(this.currentYear, this.currentMonth, -i + 1);
      this.calendarDays.push({ date, isOtherMonth: true });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.currentYear, this.currentMonth, i);
      this.calendarDays.push({ date, isOtherMonth: false });
    }

    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(this.currentYear, this.currentMonth + 1, i);
      this.calendarDays.push({ date, isOtherMonth: true });
    }
  }


  public prevWeek(): void {
    const firstDayOfWeek = this.currentWeek[0].date;
    const newStartDate = new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 7));
    this.generateWeek(newStartDate);
  }

  public nextWeek(): void {
    const lastDayOfWeek = this.currentWeek[6].date;
    const newStartDate = new Date(lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 1));
    this.generateWeek(newStartDate);
  }

  public getWeekRange(): string {
    const firstDay = this.currentWeek[0].date;
    const lastDay = this.currentWeek[6].date;
    return `${firstDay.toLocaleDateString()} - ${lastDay.toLocaleDateString()}`;
  }

  public selectDay(date: Date): void {
    this.selectedDay = date;
    console.log('Wybrano dzień:', this.selectedDay);
    this.generateWeek(date);
  }

  public prevMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  public nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  public getMealsForDay(date: Date): mealModel[] {
    return this.meals().filter((meal) => {
      return (
        meal.date.getDate() === date.getDate() &&
        meal.date.getMonth() === date.getMonth() &&
        meal.date.getFullYear() === date.getFullYear()
      );
    });
  }

  public getTrainingsForDay(date: Date): TrainingModel[] {
    return this.trainings().filter((training) => {
      return (
        training.date.getDate() === date.getDate() &&
        training.date.getMonth() === date.getMonth() &&
        training.date.getFullYear() === date.getFullYear()
      );
    });
  }

  public hasEventsForDay(date: Date): boolean {
    return (
      this.getMealsForDay(date).length > 0 ||
      this.getTrainingsForDay(date).length > 0
    );
  }
public  closeModal(): void {
  this.showModal.set(false);
}
  public editMeal(meal: mealModel): void {
    this.selectedMeal = { ...meal };
  }
public  toggleTrainingDone(training: TrainingModel): void {
  const updatedTraining = { ...training, isDone: !training.isDone };
  this.saveEditedTraining(updatedTraining);
}
  public saveEditedMeal(updatedMeal: mealModel): void {
    this.TrainingAndMealService.updateMeal(updatedMeal)
      .then(() => {
        this.meals.set(
          this.meals().map((meal) =>
            meal.id === updatedMeal.id ? updatedMeal : meal
          )
        );
      })
      .catch((error) => {
        console.error('Error saving edited meal:', error);
        alert('Nie udało się zapisać posiłku. Spróbuj ponownie.');
      });
  }

  public deleteMeal(mealId: string): void {
    this.TrainingAndMealService.deleteMeal(mealId)
      .then(() => {
        this.meals.set(this.meals().filter((meal) => meal.id !== mealId));
      })
      .catch((error) => {
        console.error('Error deleting meal:', error);
        alert('Nie udało się usunąć posiłku. Spróbuj ponownie.');
      });
  }

  public editTraining(training: TrainingModel): void {
    this.selectedTraining = { ...training };
  }

  public saveEditedTraining(updatedTraining: TrainingModel): void {
    this.TrainingAndMealService.updateTraining(updatedTraining)
      .then(() => {
        this.trainings.set(
          this.trainings().map((training) =>
            training.id === updatedTraining.id ? updatedTraining : training
          )
        );
      })
      .catch((error) => {
        console.error('Error saving edited training:', error);
        alert('Nie udało się zapisać treningu. Spróbuj ponownie.');
      });
  }

  public deleteTraining(trainingId: string): void {
    this.TrainingAndMealService.deleteTraining(trainingId)
      .then(() => {
        this.trainings.set(
          this.trainings().filter((training) => training.id !== trainingId)
        );
      })
      .catch((error) => {
        console.error('Error deleting training:', error);
        alert('Nie udało się usunąć treningu. Spróbuj ponownie.');
      });
  }
}
