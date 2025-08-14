import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Movie, MovieDetail, TMDBResponse, Credits, WatchProviderData } from '../models/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class TMDBService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = '8265bd1679663a7ea12ac168da84d2e8'; // Clave API válida para demo
  private readonly imageBaseUrl = 'https://image.tmdb.org/t/p';

  constructor(private http: HttpClient) {}

  private buildParams(params: Record<string, any> = {}): HttpParams {
    let httpParams = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'es-ES'); // Configurar idioma español
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    
    return httpParams;
  }

  getUpcomingMovies(page: number = 1): Observable<TMDBResponse<Movie>> {
    const params = this.buildParams({ page });
    return this.http.get<TMDBResponse<Movie>>(`${this.baseUrl}/movie/upcoming`, { params });
  }

  getPopularMovies(page: number = 1): Observable<TMDBResponse<Movie>> {
    const params = this.buildParams({ page });
    return this.http.get<TMDBResponse<Movie>>(`${this.baseUrl}/movie/popular`, { params });
  }

  getMovieDetails(movieId: number): Observable<MovieDetail> {
    const params = this.buildParams();
    return this.http.get<MovieDetail>(`${this.baseUrl}/movie/${movieId}`, { params });
  }

  getMovieCredits(movieId: number): Observable<Credits> {
    const params = this.buildParams();
    return this.http.get<Credits>(`${this.baseUrl}/movie/${movieId}/credits`, { params });
  }

  searchMovies(query: string, page: number = 1): Observable<TMDBResponse<Movie>> {
    const params = this.buildParams({ query, page });
    return this.http.get<TMDBResponse<Movie>>(`${this.baseUrl}/search/movie`, { params });
  }

  discoverMovies(options: {
    with_genres?: string;
    page?: number;
    sort_by?: string;
    vote_average_gte?: number;
  } = {}): Observable<TMDBResponse<Movie>> {
    const params = this.buildParams(options);
    return this.http.get<TMDBResponse<Movie>>(`${this.baseUrl}/discover/movie`, { params });
  }

  getWatchProviders(movieId: number): Observable<WatchProviderData> {
    const params = this.buildParams();
    return this.http.get<WatchProviderData>(`${this.baseUrl}/movie/${movieId}/watch/providers`, { params });
  }

  getImageUrl(path: string, size: string = 'w500'): string {
    if (!path) return 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg';
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  getBackdropUrl(path: string, size: string = 'w1280'): string {
    if (!path) return 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg';
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  findByMood(mood: string): Observable<Movie[]> {
    // Mapear estados de ánimo a géneros y parámetros de búsqueda
    const moodGenreMap: Record<string, { genres: string; sortBy?: string; minRating?: number }> = {
      'feliz': { genres: '35,10751', sortBy: 'popularity.desc' }, // Comedia, Familia
      'triste': { genres: '18,10749', sortBy: 'vote_average.desc', minRating: 7 }, // Drama, Romance
      'emocionado': { genres: '28,12,878', sortBy: 'popularity.desc' }, // Acción, Aventura, Ciencia Ficción
      'asustado': { genres: '27,9648', sortBy: 'popularity.desc' }, // Terror, Thriller
      'romantico': { genres: '10749,35', sortBy: 'vote_average.desc', minRating: 6.5 }, // Romance, Comedia
      'aventurero': { genres: '12,28', sortBy: 'popularity.desc' }, // Aventura, Acción
      'reflexivo': { genres: '18,99,36', sortBy: 'vote_average.desc', minRating: 7.5 }, // Drama, Documental, Historia
      'nostalgico': { genres: '18,10751', sortBy: 'release_date.asc' } // Drama, Familia
    };

    const config = moodGenreMap[mood.toLowerCase()] || moodGenreMap['feliz'];
    
    return this.discoverMovies({
      with_genres: config.genres,
      sort_by: config.sortBy,
      vote_average_gte: config.minRating,
      page: 1
    }).pipe(
      map(response => response.results)
    );
  }
}