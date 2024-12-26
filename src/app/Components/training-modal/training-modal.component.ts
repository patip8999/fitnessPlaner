import { Component, inject } from '@angular/core';
import { CalendarService } from '../../Services/calendar.service';
import { Training } from '../calendar/calendar.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-training-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './training-modal.component.html',
  styleUrl: './training-modal.component.css'
})
export class TrainingModalComponent {
calendarService: CalendarService = inject(CalendarService);
training: any[] = [];
model: Training ={
  name: '',
  burnedKcal: '',
  time: '',
  date: new Date(),
  id: '',
};

addTraining( name: string, burnedKcal: string, time: string, date: Date): void {
  this.calendarService.addTraining( name, burnedKcal, time, date);
  this.training.push({
   
    name, 
    burnedKcal, 
    time,
    date,
    id:''
  });
  console.groupCollapsed('Training addes:', { name, burnedKcal, time, date})
}
onDateChange(date: string): void {
  // Konwertuj ciąg daty na instancję Date
  this.model.date = new Date(date + 'T00:00:00');
}
}
