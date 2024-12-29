import { Component, inject } from '@angular/core';
import { TrainingAndMealService } from '../../Services/calendar.service';
import { FormsModule } from '@angular/forms';
import { TrainingModel } from '../../Models/training.model';

@Component({
  selector: 'app-training-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './training-modal.component.html',
  styleUrl: './training-modal.component.css',
})
export class TrainingModalComponent {
  private readonly trainingAndMealService: TrainingAndMealService = inject(
    TrainingAndMealService
  );
  private training: TrainingModel[] = [];
  traingns: any[] = [];
  model: TrainingModel = {
    name: '',
    burnedKcal: 0,
    time: '',
    date: new Date(),
    id: '',
  };

  addTraining(training: TrainingModel): void {
    this.trainingAndMealService.addTraining(training);
    this.training.push(training);
    console.log('Meal added:', training);
  }
  onDateChange(date: string): void {
    this.model.date = new Date(`${date}T00:00:00`);
  }
}
