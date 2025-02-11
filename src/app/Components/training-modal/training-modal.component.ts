import { Component, inject, signal } from '@angular/core';
import { TrainingAndMealService } from '../../Services/calendar.service';
import { FormsModule } from '@angular/forms';
import { TrainingModel } from '../../Models/training.model';
import { ModalComponent } from '../UI/modal/modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training-modal',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  templateUrl: './training-modal.component.html',
  styleUrl: './training-modal.component.css',
})
export class TrainingModalComponent {
 
  private readonly trainingAndMealService: TrainingAndMealService = inject(
    TrainingAndMealService
  );

  private training = signal<any[]>([]);
  
  model = signal<TrainingModel>( {
    name: '',
    burnedKcal: 0,
    isDone: false,
    time: '',
    date: new Date(),
    id: '',
    videoLink: '',
    imageUrl: '',
  });

  addTraining(training: TrainingModel): void {
    this.trainingAndMealService.addTraining(training);
    this.training.update((training) => [...training, training]);
 this.resetForm();
  }

 onDateChange(date: string): void {
    this.model.update((currentModel) => ({
      ...currentModel,
      date: new Date(date + 'T00:00:00'),
    }));
  }
  resetForm(): void {
    this.model.set({
      name: '',
      burnedKcal: 0,
      isDone: false,
      time: '',
      date: new Date(),
      id: '',
      videoLink: '',
      imageUrl: '',
    });
  }
}
