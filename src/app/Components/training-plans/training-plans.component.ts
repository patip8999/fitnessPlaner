import { Component, inject, OnInit } from '@angular/core';
import { YoutubeService } from '../../Services/youtube.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-training-plans',
  standalone: true,
  imports: [],
  templateUrl: './training-plans.component.html',
  styleUrl: './training-plans.component.css'
})
export class TrainingPlansComponent implements OnInit {
  videos: { title: string; url: SafeResourceUrl }[] = [];
  private youtubeService = inject(YoutubeService);
  private sanitizer = inject(DomSanitizer);

  ngOnInit() {
    this.youtubeService.searchVideos('trening siłowy')
      .subscribe((response: any) => {
        this.videos = response.items.map((item: any) => ({
          title: item.snippet.title,
          url: this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${item.id.videoId}`)
        }));
      });
  }
}