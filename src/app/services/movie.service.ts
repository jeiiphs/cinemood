import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = 'tu_api_key'; // Reemplaza con tu API key de TMDB
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  getMovieDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=es-ES`);
  }

  getMovieCredits(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}/credits?api_key=${this.apiKey}`);
  }

  getMovieVideos(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}/videos?api_key=${this.apiKey}&language=es-ES`);
  }

  getSimilarMovies(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/${id}/similar?api_key=${this.apiKey}&language=es-ES`);
  }

  getUpcomingMovies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie/upcoming?api_key=${this.apiKey}&language=es-ES&region=ES`);
  }

  getMovieTrailer(movieId: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/${movieId}/videos?api_key=${this.apiKey}&language=es-ES`
    );
  }

  getWatchProviders(movieId: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/movie/${movieId}/watch/providers?api_key=${this.apiKey}`
    );
  }
}
