import { Component, inject } from '@angular/core';
import { FitnessPlanService } from '../../Services/fitness-plan.service';
import { TrainingPlanModel } from '../../Models/training-plan.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrainingAndMealService } from '../../Services/calendar.service';
import { TrainingModel } from '../../Models/training.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-training-plans-select',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './training-plans-select.component.html',
  styleUrl: './training-plans-select.component.css'
})
export class TrainingPlansSelectComponent {
  private fitnessPlanService = inject(FitnessPlanService);
  private calendarService = inject(TrainingAndMealService);
  fitnessPlans: TrainingPlanModel[] = [];
  selectedPlan: TrainingPlanModel | null = null;
  startDate: Date = new Date();
  private router = inject(Router);
  constructor() {
    this.fitnessPlanService.getAllFitnessPlans().subscribe((plans) => {
      console.log('Plany w komponencie:', plans);
      this.fitnessPlans = plans;
    });
  }

  selectPlan(plan: TrainingPlanModel): void {
    console.log('Wybrano plan:', plan);
    this.selectedPlan = plan;
  }
  goToPlanDetails(planId: string): void {
    this.router.navigate([`/plan/${planId}`]);  
  }

  startPlan(): void {
    console.log('Rozpoczynanie planu:', this.selectedPlan);
  
    if (this.selectedPlan) {
      let startDate = this.startDate;
  
      // Upewniamy się, że startDate to obiekt Date
      if (!(startDate instanceof Date)) {
        startDate = new Date(startDate); 
      }
  
      this.selectedPlan.days.forEach((day, index) => {
        const trainingDate = new Date(startDate);
        trainingDate.setDate(startDate.getDate() + index);
  
      
        const trainingName = day.name ? `Trening: ${day.name}` : `Trening: Dzień ${index + 1}`;
        const burnedKcal = day.burnedKcal || 0;
        const duration = day.time || 0; 
      
        this.calendarService.addTraining({
          name: trainingName,
          date: trainingDate,
          burnedKcal: burnedKcal, 
          time: duration, 
          videoLink: day.videoLink, 
        } as TrainingModel); 
        this.router.navigate(['/home']);
        console.log(
          `Dodano trening dnia ${trainingDate.toISOString()}: ${day.videoLink}`
        );
      });
    }
  }

  deletePlan(plan: TrainingPlanModel): void {
    // Usuwanie planu
    this.fitnessPlanService.deleteFitnessPlan(plan.id);
    // Opcjonalnie możesz usunąć plan z listy po stronie klienta
    this.fitnessPlans = this.fitnessPlans.filter(p => p.id !== plan.id);
    console.log('Plan usunięty', plan);
  }
}

