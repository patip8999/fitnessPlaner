import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { TrainingAndMealService } from '../../Services/calendar.service';

import { MealModalComponent } from '../meal-modal/meal-modal.component';
import { RouterModule } from '@angular/router';
import { TrainingModalComponent } from '../training-modal/training-modal.component';
import { mealModel } from '../../Models/meal.model';
import { TrainingModel } from '../../Models/training.model';
import { EditComponent } from '../edit/edit.component';
import { EditTrainingComponent } from '../edit-training/edit-training.component';
import { TrainingPlanModel } from '../../Models/training-plan.model';
import { FormsModule } from '@angular/forms';
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
    MealModalComponent,
    RouterModule,
    TrainingModalComponent,
    EditComponent,
    EditTrainingComponent,
    FormsModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  private TrainingAndMealService = inject(TrainingAndMealService);

  meals: WritableSignal<mealModel[]> = signal<mealModel[]>([]);
  trainings: WritableSignal<TrainingModel[]> = signal<TrainingModel[]>([]);
  calendarDays: CalendarDay[] = [];

  readonly currentDate: Date = new Date();
  currentMonth: number = this.currentDate.getMonth();
  currentYear: number = this.currentDate.getFullYear();
  selectedMeal: mealModel | null = null;
  selectedTraining: TrainingModel | null = null;
  public readonly showModal = signal(false);
  constructor() {
    this.loadData();
    this.generateCalendar();
  }

  private loadData(): void {
    this.TrainingAndMealService.getTrainings().subscribe((trainings) => {
      const parsedTrainings = trainings.map((training, index) => ({
        ...training,
        id: training.id || `training-${index}-${new Date().getTime()}`,
        date: new Date(training.date),
      }));
      this.trainings.set(parsedTrainings);
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
  getMealsForDay(date: Date): mealModel[] {
    return this.meals().filter((meal) => {
      return (
        meal.date.getDate() === date.getDate() &&
        meal.date.getMonth() === date.getMonth() &&
        meal.date.getFullYear() === date.getFullYear()
      );
    });
  }

  getTrainingsForDay(date: Date): TrainingModel[] {
    return this.trainings().filter((training) => {
      return (
        training.date.getDate() === date.getDate() &&
        training.date.getMonth() === date.getMonth() &&
        training.date.getFullYear() === date.getFullYear()
      );
    });
  }

  readonly dayNames: string[] = ['Pn', 'Wt', 'Śr', 'Czw', 'Pt', 'Sb', 'Nd'];
  readonly months: string[] = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ];

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

  prevMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  saveEditedMeal(updatedMeal: mealModel): void {
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
  editMeal(meal: mealModel): void {
    this.selectedMeal = { ...meal };
  }

  closeModal(): void {
    this.showModal.set(false);
  }
  saveEditedTraining(updatedTraining: TrainingModel): void {
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

  editTraining(training: TrainingModel): void {
    this.selectedTraining = { ...training };
  }
  deleteMeal(mealId: string): void {
    this.TrainingAndMealService.deleteMeal(mealId)
      .then(() => {
        this.meals.set(this.meals().filter((meal) => meal.id !== mealId));
      })
      .catch((error) => {
        console.error('Error deleting meal:', error);
        alert('Nie udało się usunąć posiłku. Spróbuj ponownie.');
      });
  }

  deleteTraining(trainingId: string): void {
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
  toggleTrainingDone(training: TrainingModel): void {
    const updatedTraining = { ...training, isDone: !training.isDone };
    this.saveEditedTraining(updatedTraining);
  }
}
