import { Component, inject } from '@angular/core';
import { CalendarService } from '../../Services/calendar.service';
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
  calendarService: CalendarService = inject(CalendarService);
  training: any[] = [];
  model: TrainingModel = {
    name: '',
    burnedKcal: 0,
    time: '',
    date: new Date(),
    id: '',
  };

  addTraining(
    name: string,
    burnedKcal: number,
    time: string,
    date: Date
  ): void {
    this.calendarService.addTraining(name, burnedKcal, time, date);
    this.training.push({
      name,
      burnedKcal,
      time,
      date,
      id: '',
    });
    console.groupCollapsed('Training addes:', { name, burnedKcal, time, date });
  }
  onDateChange(date: string): void {
    this.model.date = new Date(date + 'T00:00:00');
  }
}
