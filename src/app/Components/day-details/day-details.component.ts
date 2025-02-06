import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
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
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-day-details',
  standalone: true,
  imports: [DatePipe, CaloriesBalancePipe, CommonModule, FormsModule],
  templateUrl: './day-details.component.html',
  styleUrls: ['./day-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayDetailsComponent {
  commentsService: CommentsService = inject(CommentsService);
  readonly comment: WritableSignal<string> = signal('');
  readonly comments: WritableSignal<any[]> = signal([]);
  readonly day: WritableSignal<Date | null> = signal<Date | null>(null);
  readonly meals: WritableSignal<any[]> = signal<any[]>([]);
  readonly trainings: WritableSignal<any[]> = signal<any[]>([]);
  tdee: number = 0;
  calorieService: CalorieService = inject(CalorieService);
  youtubeService: YoutubeService = inject(YoutubeService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly trainingAndMealService: TrainingAndMealService = inject(
    TrainingAndMealService
  );
  videoDetails: any = null;
  videoId: string | null = null;
  sanitizer: DomSanitizer = inject(DomSanitizer);
  videoUrl: SafeResourceUrl | null = null;
  calorieData = {
    tdee: 0,
  };

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const dayParam = params.get('day');
      console.log('Dzień z parametru URL:', dayParam);

      if (dayParam) {
        const day = new Date(dayParam);
        this.day.set(day);
        this.loadDetails(day);
      }
    });

    this.loadTdeeFromFirebase();
  }

  private loadDetails(day: Date): void {
    this.trainingAndMealService.getMealsByDate(day)
      .pipe(
        switchMap((meals) => {
          this.meals.set(meals);
          return this.trainingAndMealService.getTrainingsByDate(day);
        })
      )
      .subscribe((trainings) => {
        this.trainings.set(trainings);
        this.checkForVideo(trainings);
      });
  
    this.loadComments();
  }
  private loadTdeeFromFirebase(): void {
    this.calorieService.loadTdee().subscribe(
      (data) => {
        if (data) {
          this.tdee = data.tdee;
          console.log('Pobrano TDEE z Firebase:', this.tdee);
        } else {
          console.log('Brak danych o TDEE w Firebase');
        }
      },
      (err) => {
        console.error('Błąd ładowania TDEE:', err);
      }
    );
  }

  private checkForVideo(trainings: any[]): void {
    const videoTraining = trainings.find((training) => training.videoLink);
    if (videoTraining) {
      console.log('Training with video link found:', videoTraining);
      this.videoId = this.extractVideoId(videoTraining.videoLink);
      if (this.videoId) {
        this.loadVideoDetails(this.videoId);
      } else {
        console.error('Brak ID wideo w linku');
        this.videoUrl = null;
      }
    } else {
      console.log('Brak linku do wideo');
      this.videoId = null;
      this.videoDetails = null;
      this.videoUrl = null;
    }
  }

  private extractVideoId(url: string): string | null {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/)+|(?:v\/|e\/|u\/\w\/|embed\/|shorts\/|watch\?v=)|youtu\.be\/)([^#&?]*).*/;
    const match = url.match(regex);
    console.log('Extracted video ID:', match ? match[1] : null);
    return match ? match[1] : null;
  }

  private loadVideoDetails(videoId: string | null): void {
    if (videoId) {
      this.youtubeService.getVideoDetails(videoId).subscribe(
        (response: YouTubeVideoResponse) => {
          console.log('Odpowiedź z YouTube:', response);
          if (response.items && response.items.length > 0) {
            this.videoDetails = response.items[0];
            this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${videoId}`
            );
          } else {
            console.error('Brak wyników dla wideo');
            this.videoDetails = null;
            this.videoUrl = null;
          }
        },
        (error) => {
          console.error('Błąd ładowania wideo:', error);
        }
      );
    }
  }
loadComments(): void {
  const dayParam = this.day(); 
  if (!dayParam) return; 

  this.commentsService.getCommentsForDay(dayParam).subscribe((data) => {
    this.comments.set(data);
  });
}

  addComment(): void {
    const newComment = this.comment();
    console.log('Nowy komentarz:', newComment); 
    if (!newComment.trim()) return; 
  
    const date = new Date();
    this.commentsService.addComment(newComment, date); 
  
 
    this.comments.update((prevComments) => [
      ...prevComments,
      { text: newComment, date: date.toISOString().split('T')[0] },
    ]);
    
   
    this.comment.set('');
  }

  onCommentChange(event: Event): void {
    const target = event.target as HTMLInputElement; 
    this.comment.set(target.value); 
  }
}


