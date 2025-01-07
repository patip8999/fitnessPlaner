import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BaseChartDirective } from 'ng2-charts';
import { MeasurementsService } from '../../Services/measurements.service';
import { MeasurementModel } from '../../Models/measurements.model';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-weight-control',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './weight-control.component.html',
  styleUrl: './weight-control.component.css'
})
export class WeightControlComponent {
  measurements: MeasurementModel[] = [];
  isFormVisible = false;
  // Formularz nowego pomiaru
  newMeasurement: MeasurementModel = {
    id: '',
    date: new Date().toISOString().split('T')[0],
    waist: 0,
    hips: 0,
    buttocks: 0,
    thigh: 0,
    arms: 0,
    chest: 0,
    weight: 0
  };

  constructor(private measurementsService: MeasurementsService) {}

  ngOnInit(): void {
    this.loadMeasurements(); // Ładowanie danych po inicjalizacji komponentu
  }

  // Załaduj wszystkie pomiary
  loadMeasurements(): void {
    this.measurementsService.getMeasurements().subscribe(measurements => {
      this.measurements = measurements;
    });
  }

  // Dodawanie nowego pomiaru
  addMeasurement(): void {
    this.measurementsService.addMeasurement(this.newMeasurement).then(() => {
      this.loadMeasurements(); 
    });

  
    this.newMeasurement = {
      id: '',
      date: new Date().toISOString().split('T')[0],
      waist: 0,
      hips: 0,
      buttocks: 0,
      thigh: 0,
      arms: 0,
      chest: 0,
      weight: 0
    };
  }

 
  calculateChange(measurement: MeasurementModel, index: number): string {
    if (index === 0) return '-'; 
    
    const prevMeasurement = this.measurements[index - 1];
    const change = measurement.weight - prevMeasurement.weight;
    return change.toFixed(2); 
  }

  
  getStyle(measurement: MeasurementModel, index: number, key: keyof MeasurementModel): any {
    if (index === 0) return {}; 
  
    const prevMeasurement = this.measurements[index - 1];
    const currentValue = measurement[key];
    const previousValue = prevMeasurement[key];
  
    // Sprawdzamy, czy wartości są liczbami
    if (typeof currentValue === 'number' && typeof previousValue === 'number') {
      const change = currentValue - previousValue;
  
      if (change > 0) {
        return { 'color': 'red' }; 
      } else if (change < 0) {
        return { 'color': 'green' };
      } else {
        return { 'color': 'black' }; 
      }
    }
  
 
    return {};
  }
  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }

}
