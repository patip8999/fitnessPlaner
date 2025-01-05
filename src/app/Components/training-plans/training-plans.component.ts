import { Component, inject, OnInit } from '@angular/core';
import { YoutubeService } from '../../Services/youtube.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TrainingPlanDay, TrainingPlanModel } from '../../Models/training-plan.model';
import { TrainingAndMealService } from '../../Services/calendar.service';
import { FormsModule } from '@angular/forms';
import { FitnessPlanService } from '../../Services/fitness-plan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training-plans',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './training-plans.component.html',
  styleUrl: './training-plans.component.css'
})
export class TrainingPlansComponent  {
  private fitnessPlanService = inject(FitnessPlanService);
  private router = inject(Router);

  plans: TrainingPlanModel[] = []; // Lista wszystkich planów
  planName: string = '';
  days: TrainingPlanDay[] = [];

  constructor() {
    this.loadAllPlans();
  }

  loadAllPlans(): void {
    this.fitnessPlanService.getAllFitnessPlans().subscribe((plans) => {
      console.log('Wszystkie plany:', plans);
      this.plans = plans;
    });
  }

  addDay(): void {
    this.days.push({
      date: '',
      videoLink: '',
      duration: 0,
      burnedKcal: 0,
    });
  }

  removeDay(index: number): void {
    this.days.splice(index, 1);
  }

  savePlan(): void {
    const newPlan: TrainingPlanModel = {
      id: this.fitnessPlanService.client.createId(),
      name: this.planName,
      days: this.days,
      uid: '', // UID nie jest przypisywane tutaj
    };

    this.fitnessPlanService.createFitnessPlan(newPlan);
    this.router.navigate(['/fitness-plans']);
  }
}