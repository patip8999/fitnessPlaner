import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';
export interface YouTubeVideoResponse {
  kind: string;
  etag: string;
  items: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      thumbnails: {
        default: { url: string };
      };
    };
  }>;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}
@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private http = inject(HttpClient);
  private apiUrl = 'https://www.googleapis.com/youtube/v3';

  getVideoDetails(videoId: string): Observable<YouTubeVideoResponse> {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails,statistics&key=${environment.youtubeApiKey}`;
    return this.http.get<YouTubeVideoResponse>(url); // Określamy typ odpowiedzi
  }

  searchVideos(query: string, maxResults: number = 10) {
    const url = `${this.apiUrl}/search?part=snippet&q=${query}&maxResults=${maxResults}&key=${environment.youtubeApiKey}`;
    return this.http.get(url);
  }
}