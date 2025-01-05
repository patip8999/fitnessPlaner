import { Component, inject } from '@angular/core';
import { FitnessPlanService } from '../../Services/fitness-plan.service';
import { TrainingPlanModel } from '../../Models/training-plan.model';
import {  ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-training-plan-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './training-plan-detail.component.html',
  styleUrl: './training-plan-detail.component.css'
})
export class TrainingPlanDetailComponent {
  private fitnessPlanService = inject(FitnessPlanService);
  route: ActivatedRoute = inject(ActivatedRoute);
  planId: string | null = null;
  plan: TrainingPlanModel | null | undefined = undefined;

  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get('id');
    console.log('Fetched Plan ID:', planId); // Dodaj to logowanie
    if (planId) {
      this.fitnessPlanService.getFitnessPlanById(planId).subscribe(plan => {
        if (plan) {
          this.plan = plan;
        } else {
          console.log('Brak planu dla ID:', planId);
        }
      });
    }
  }

  savePlanEdits(): void {
    if (this.plan) {
      console.log('Zmiany zapisane dla planu:', this.plan);
      // Logika zapisywania planu
    }
  }
}