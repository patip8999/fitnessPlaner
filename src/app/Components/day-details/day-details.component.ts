import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  WritableSignal,
  computed,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingAndMealService } from '../../Services/calendar.service';
import { CommonModule, DatePipe } from '@angular/common';
import {
  YoutubeService,
  YouTubeVideoResponse,
} from '../../Services/youtube.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CalorieService } from '../../Services/calorie.service';
import { CaloriesBalancePipe } from '../../Pipes/calories-balance.pipe';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../Services/comments.service';
import { switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-day-details',
  standalone: true,
  imports: [DatePipe, CaloriesBalancePipe, CommonModule, FormsModule],
  templateUrl: './day-details.component.html',
  styleUrls: ['./day-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayDetailsComponent {
  private commentsService = inject(CommentsService);
  private calorieService = inject(CalorieService);
  private youtubeService = inject(YoutubeService);
  private route = inject(ActivatedRoute);
  private trainingAndMealService = inject(TrainingAndMealService);
  private sanitizer = inject(DomSanitizer);

  readonly comment = signal<string>('');
  readonly comments = signal<any[]>([]);
  readonly day = signal<Date | null>(null);
  readonly meals = signal<any[]>([]);
  readonly trainings = signal<any[]>([]);
  readonly tdee = signal<number>(0);
  readonly videoDetails = signal<any>(null);
  readonly videoId = signal<string | null>(null);
  readonly videoUrl = computed<SafeResourceUrl | null>(() => {
    const id = this.videoId();
    return id
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${id}`
        )
      : null;
  });
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const dayParam = params.get('day');
      if (dayParam) {
        const day = new Date(dayParam);
        this.day.set(day);
        this.loadDetails(day);
      }
    });

    this.loadTdeeFromFirebase();
  }

  private loadDetails(day: Date): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.trainingAndMealService
      .getMealsByDate(day)
      .pipe(
        switchMap((meals) => {
          this.meals.set(meals);
          return this.trainingAndMealService.getTrainingsByDate(day);
        }),
        catchError((err) => {
          this.error.set('Wystąpił błąd podczas ładowania danych.');
          this.isLoading.set(false);
          return of([]);
        })
      )
      .subscribe({
        next: (trainings) => {
          this.trainings.set(trainings);
          this.checkForVideo(trainings);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Wystąpił błąd podczas ładowania danych.');
          this.isLoading.set(false);
        },
      });

    this.loadComments();
  }

  private loadTdeeFromFirebase(): void {
    this.calorieService.loadTdee().subscribe({
      next: (data) => {
        if (data) {
          this.tdee.set(data.tdee);
        } else {
          this.error.set('Brak danych o TDEE w Firebase.');
        }
      },
      error: (err) => {
        this.error.set('Błąd ładowania TDEE z Firebase.');
      },
    });
  }

  private checkForVideo(trainings: any[]): void {
    const videoTraining = trainings.find((training) => training.videoLink);
    if (videoTraining) {
      const videoId = this.extractVideoId(videoTraining.videoLink);
      if (videoId) {
        this.videoId.set(videoId);
        this.loadVideoDetails(videoId);
      } else {
        this.error.set('Nieprawidłowy link do wideo.');
      }
    }
  }

  private extractVideoId(url: string): string | null {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/)+|(?:v\/|e\/|u\/\w\/|embed\/|shorts\/|watch\?v=)|youtu\.be\/)([^#&?]*).*/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  private loadVideoDetails(videoId: string): void {
    this.youtubeService.getVideoDetails(videoId).subscribe({
      next: (response: YouTubeVideoResponse) => {
        if (response.items && response.items.length > 0) {
          this.videoDetails.set(response.items[0]);
        } else {
          this.error.set('Brak wyników dla wideo.');
        }
      },
      error: (err) => {
        this.error.set('Błąd ładowania wideo.');
      },
    });
  }

  private loadComments(): void {
    const day = this.day();
    if (!day) return;

    this.commentsService.getCommentsForDay(day).subscribe({
      next: (data) => this.comments.set(data),
      error: (err) => this.error.set('Błąd ładowania komentarzy.'),
    });
  }

  addComment(): void {
    const newComment = this.comment().trim();
    if (!newComment) return;

    const date = new Date();
    this.commentsService.addComment(newComment, date).subscribe({
      next: () => {
        this.comments.update((prevComments) => [
          ...prevComments,
          { text: newComment, date: date.toISOString().split('T')[0] },
        ]);
        this.comment.set('');
      },
      error: (err) => this.error.set('Błąd dodawania komentarza.'),
    });
  }

  onCommentChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.comment.set(target.value);
  }
}
