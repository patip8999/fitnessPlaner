import { Component, inject } from '@angular/core';
import { FitnessPlanService } from '../../Services/fitness-plan.service';
import { TrainingPlanModel } from '../../Models/training-plan.model';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-training-plan-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './training-plan-detail.component.html',
  styleUrl: './training-plan-detail.component.css',
})
export class TrainingPlanDetailComponent {
  private fitnessPlanService = inject(FitnessPlanService);
  route: ActivatedRoute = inject(ActivatedRoute);
  planId: string | null = null;
  plan: TrainingPlanModel | null | undefined = undefined;
  sanitizer: DomSanitizer = inject(DomSanitizer);
  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get('id');
    console.log('Fetched Plan ID:', planId);
    if (planId) {
      this.fitnessPlanService.getFitnessPlanById(planId).subscribe((plan) => {
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
      this.fitnessPlanService.updateFitnessPlan(this.plan);
      console.log('Zmiany zapisane dla planu:', this.plan);
    }
  }
  getVideoUrl(url: string): SafeResourceUrl {
    if (url) {
      const videoId = this.extractVideoId(url);
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
    return '';
  }

  private extractVideoId(url: string): string | null {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/)+|(?:v\/|e\/|u\/\w\/|embed\/|shorts\/|watch\?v=)|youtu\.be\/)([^#&?]*).*/;
    const match = url.match(regex);
    console.log('Extracted video ID:', match ? match[1] : null);
    return match ? match[1] : null;
  }
}
