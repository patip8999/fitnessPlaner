import { Component, inject } from '@angular/core';
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
  addMeal($event: Event) {
    throw new Error('Method not implemented.');
  }
  private readonly trainingAndMealService: TrainingAndMealService = inject(
    TrainingAndMealService
  );
  router: Router = inject(Router);
  private training: TrainingModel[] = [];
  traingns: any[] = [];
  model: TrainingModel = {
    name: '',
    burnedKcal: 0,
    isDone: false,
    time: '',
    date: new Date(),
    id: '',
    videoLink: '',
  };

  addTraining(training: TrainingModel): void {
    this.trainingAndMealService.addTraining(training);
    this.training.push(training);
    console.log('Meal added:', training);
    this.router.navigate(['/home']);
    this.resetForm();
  }
  onDateChange(date: string): void {
    this.model.date = new Date(`${date}T00:00:00`);
  }
  resetForm(): void {
    this.model = {
      name: '',
      burnedKcal: 0,
      isDone: false,
      time: '',
      date: new Date(),
      id: '',
      videoLink: '',
    };
  }
}
