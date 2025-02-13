import { Component, inject, signal } from '@angular/core';
import { FitnessPlanService } from '../../Services/fitness-plan.service';
import { TrainingPlanModel } from '../../Models/training-plan.model';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-training-plan-detail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './training-plan-detail.component.html',
  styleUrls: ['./training-plan-detail.component.css'],
})
export class TrainingPlanDetailComponent {
  private fitnessPlanService = inject(FitnessPlanService);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  // Sygnały do zarządzania stanem
  planId = signal<string | null>(null);
  plan = signal<TrainingPlanModel | null | undefined>(undefined);
  errorMessage = signal<string | null>(null);

  // Cache dla URL filmów
  private videoUrlCache = new Map<string, SafeResourceUrl>();

  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get('id');
    this.planId.set(planId);

    if (planId) {
      this.fitnessPlanService.getFitnessPlanById(planId).subscribe({
        next: (plan) => {
          if (plan) {
            this.plan.set(plan);
          } else {
            this.errorMessage.set('Brak planu dla ID: ' + planId);
          }
        },
        error: (err) => {
          this.errorMessage.set('Błąd podczas pobierania planu: ' + err.message);
        },
      });
    }
  }

  savePlanEdits(): void {
    const plan = this.plan();
    if (plan) {
      this.fitnessPlanService.updateFitnessPlan(plan).subscribe({
        next: () => {
          console.log('Zmiany zapisane dla planu:', plan);
        },
        error: (err) => {
          this.errorMessage.set('Błąd podczas zapisywania zmian: ' + err.message);
        },
      });
    }
  }

  getVideoUrl(url: string): SafeResourceUrl {
    if (!url) return '';

    // Sprawdź, czy URL jest już w cache'u
    if (this.videoUrlCache.has(url)) {
      return this.videoUrlCache.get(url)!;
    }

    // Wyekstrahuj ID wideo i utwórz bezpieczny URL
    const videoId = this.extractVideoId(url);
    if (!videoId) return '';

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);

    // Dodaj URL do cache'u
    this.videoUrlCache.set(url, safeUrl);

    return safeUrl;
  }

  private extractVideoId(url: string): string | null {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/)+|(?:v\/|e\/|u\/\w\/|embed\/|shorts\/|watch\?v=)|youtu\.be\/)([^#&?]*).*/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}