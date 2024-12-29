import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingAndMealService } from '../../Services/calendar.service';
import { DatePipe } from '@angular/common';
import { CaloriesBalancePipe } from '../../Pipes/calories-balance.pipe';

@Component({
  selector: 'app-day-details',
  standalone: true,
  imports: [DatePipe, CaloriesBalancePipe],
  templateUrl: './day-details.component.html',
  styleUrls: ['./day-details.component.css'],
})
export class DayDetailsComponent {
  readonly day: WritableSignal<Date | null> = signal<Date | null>(null);
  readonly meals: WritableSignal<any[]> = signal<any[]>([]);
  readonly trainings: WritableSignal<any[]> = signal<any[]>([]);

  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly trainingAndMealService: TrainingAndMealService = inject(TrainingAndMealService);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const dayParam = params.get('day');
      console.log('Dzień z parametru URL:', dayParam);

      if (dayParam) {
        const day = new Date(dayParam);
        this.day.set(day);
        this.loadDetails(day);
      }
    });
  }

  private loadDetails(day: Date): void {
    this.trainingAndMealService.getMealsByDate(day).subscribe((meals) => {
      console.log('Pobrane posiłki:', meals);
      this.meals.set(meals);
    });

    this.trainingAndMealService.getTrainingsByDate(day).subscribe((trainings) => {
      console.log('Pobrane treningi:', trainings);
      this.trainings.set(trainings);
    });
  }
}
