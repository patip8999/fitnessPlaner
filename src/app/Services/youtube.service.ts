import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://www.googleapis.com/youtube/v3';

  getVideoDetails(videoId: string) {
    const url = `${this.apiUrl}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${environment.youtubeApiKey}`;
    return this.http.get(url);
  }

  searchVideos(query: string, maxResults: number = 10) {
    const url = `${this.apiUrl}/search?part=snippet&q=${query}&maxResults=${maxResults}&key=${environment.youtubeApiKey}`;
    return this.http.get(url);
  }
}