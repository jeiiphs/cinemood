import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, distinctUntilChanged, switchMap, startWith, tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Movie, WatchProviderData, WatchProvider } from '../../models/movie.interface';
import { TMDBService } from '../../services/tmdb.service';

@Component({
  selector: 'app-platform-finder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="platform-finder-container">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">
            <mat-icon>search</mat-icon>
            Dónde Ver
          </h1>
          <p class="page-description">
            Descubre en qué plataformas de streaming están tus películas y series favoritas
          </p>
        </div>

        <div class="search-section">
          <mat-form-field class="search-field" appearance="outline">
            <mat-label>Buscar una película o serie de TV</mat-label>
            <input
              matInput
              [formControl]="searchControl"
              placeholder="ej. Los Vengadores, Breaking Bad..."
              (focus)="onSearchFocus()"
            />
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <!-- FIX: separo (async) as results de las condiciones -->
          <ng-container *ngIf="(searchResults$ | async) as results">
            <div class="search-results" *ngIf="showSearchResults && (results?.length ?? 0) > 0">
              <div 
                *ngFor="let movie of results; trackBy: trackByMovieId" 
                class="search-result-item"
                (click)="selectMovie(movie)"
              >
                <img 
                  [src]="getImageUrl(movie.poster_path)" 
                  [alt]="movie.title"
                  class="result-poster"
                />
                <div class="result-info">
                  <h3>{{ movie.title }}</h3>
                  <p>{{ formatDate(movie.release_date) }}</p>
                  <div class="rating" *ngIf="movie.vote_average > 0">
                    <mat-icon>star</mat-icon>
                    <span>{{ movie.vote_average | number:'1.1-1' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </ng-container>
        </div>

        <div class="selected-movie" *ngIf="selectedMovie">
          <div class="movie-header">
            <img 
              [src]="getImageUrl(selectedMovie.poster_path)" 
              [alt]="selectedMovie.title"
              class="movie-poster"
            />
            <div class="movie-info">
              <h2>{{ selectedMovie.title }}</h2>
              <p class="release-date">{{ formatDate(selectedMovie.release_date) }}</p>
              <p class="overview">{{ selectedMovie.overview }}</p>
              <div class="rating" *ngIf="selectedMovie.vote_average > 0">
                <mat-icon>star</mat-icon>
                <span>{{ selectedMovie.vote_average | number:'1.1-1' }}/10</span>
              </div>
            </div>
          </div>

          <div class="providers-section">
            <h3>
              <mat-icon>tv</mat-icon>
              Disponible En
            </h3>

            <div class="loading-providers" *ngIf="loadingProviders">
              <mat-spinner diameter="30"></mat-spinner>
              <span>Buscando plataformas de streaming...</span>
            </div>

            <div class="providers-content" *ngIf="!loadingProviders && watchProviders">
              <div class="provider-category" *ngIf="watchProviders.flatrate?.length">
                <h4>
                  <mat-icon>subscriptions</mat-icon>
                  Suscripción
                </h4>
                <div class="provider-chips">
                  <mat-chip 
                    *ngFor="let provider of watchProviders.flatrate"
                    class="provider-chip subscription"
                  >
                    <img 
                      [src]="getProviderLogo(provider.logo_path)" 
                      [alt]="provider.provider_name"
                      class="provider-logo"
                    />
                    {{ provider.provider_name }}
                  </mat-chip>
                </div>
              </div>

              <div class="provider-category" *ngIf="watchProviders.rent?.length">
                <h4>
                  <mat-icon>attach_money</mat-icon>
                  Alquiler
                </h4>
                <div class="provider-chips">
                  <mat-chip 
                    *ngFor="let provider of watchProviders.rent"
                    class="provider-chip rent"
                  >
                    <img 
                      [src]="getProviderLogo(provider.logo_path)" 
                      [alt]="provider.provider_name"
                      class="provider-logo"
                    />
                    {{ provider.provider_name }}
                  </mat-chip>
                </div>
              </div>

              <div class="provider-category" *ngIf="watchProviders.buy?.length">
                <h4>
                  <mat-icon>shopping_cart</mat-icon>
                  Comprar
                </h4>
                <div class="provider-chips">
                  <mat-chip 
                    *ngFor="let provider of watchProviders.buy"
                    class="provider-chip buy"
                  >
                    <img 
                      [src]="getProviderLogo(provider.logo_path)" 
                      [alt]="provider.provider_name"
                      class="provider-logo"
                    />
                    {{ provider.provider_name }}
                  </mat-chip>
                </div>
              </div>

              <div class="no-providers" *ngIf="!watchProviders.flatrate?.length && !watchProviders.rent?.length && !watchProviders.buy?.length">
                <mat-icon>info</mat-icon>
                <p>No se encontraron proveedores de streaming para este título en tu región.</p>
                <small>La disponibilidad puede variar según la ubicación y puede cambiar con el tiempo.</small>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="!selectedMovie && !searchControl.value">
          <mat-icon>search</mat-icon>
          <h3>Buscar Películas y Series de TV</h3>
          <p>Ingresa el título de cualquier película o serie de TV para encontrar dónde puedes verla</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .platform-finder-container {
      min-height: 100vh;
      padding: 2rem 0;
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 3rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: white;
    }

    .page-title mat-icon {
      color: #e50914;
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
    }

    .page-description {
      font-size: 1.2rem;
      color: #ccc;
      max-width: 600px;
      margin: 0 auto;
    }

    .search-section {
      max-width: 600px;
      margin: 0 auto 3rem;
      position: relative;
    }

    .search-field {
      width: 100%;
      font-size: 1.1rem;
    }

    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.95);
      border: 1px solid rgba(229, 9, 20, 0.3);
      border-radius: 8px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
      margin-top: 0.5rem;
    }

    .search-result-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      cursor: pointer;
      transition: background 0.3s ease;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .search-result-item:hover {
      background: rgba(229, 9, 20, 0.1);
    }

    .search-result-item:last-child {
      border-bottom: none;
    }

    .result-poster {
      width: 60px;
      height: 90px;
      object-fit: cover;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .result-info {
      flex: 1;
    }

    .result-info h3 {
      color: white;
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .result-info p {
      color: #ccc;
      margin: 0 0 0.25rem 0;
      font-size: 0.9rem;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #ffd700;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .rating mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .selected-movie {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .movie-header {
      display: flex;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .movie-poster {
      width: 200px;
      height: 300px;
      object-fit: cover;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .movie-info {
      flex: 1;
    }

    .movie-info h2 {
      font-size: 2.5rem;
      color: white;
      margin: 0 0 0.5rem 0;
      font-weight: 700;
    }

    .release-date {
      color: #e50914;
      font-size: 1.1rem;
      margin: 0 0 1rem 0;
      font-weight: 500;
    }

    .overview {
      color: #ccc;
      font-size: 1rem;
      line-height: 1.6;
      margin: 0 0 1rem 0;
    }

    .movie-info .rating {
      font-size: 1.1rem;
    }

    .providers-section h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.8rem;
      color: white;
      margin-bottom: 2rem;
    }

    .providers-section h3 mat-icon {
      color: #e50914;
      font-size: 1.8rem;
      width: 1.8rem;
      height: 1.8rem;
    }

    .loading-providers {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #ccc;
      justify-content: center;
      padding: 2rem;
    }

    .provider-category {
      margin-bottom: 2rem;
    }

    .provider-category h4 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.2rem;
      color: white;
      margin-bottom: 1rem;
    }

    .provider-category h4 mat-icon {
      color: #4CAF50;
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }

    .provider-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .provider-chip {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      padding: 0.5rem 1rem;
      color: white;
      font-weight: 500;
    }

    .provider-chip.subscription {
      border-color: rgba(76, 175, 80, 0.5);
      background: rgba(76, 175, 80, 0.1);
    }

    .provider-chip.rent {
      border-color: rgba(255, 193, 7, 0.5);
      background: rgba(255, 193, 7, 0.1);
    }

    .provider-chip.buy {
      border-color: rgba(33, 150, 243, 0.5);
      background: rgba(33, 150, 243, 0.1);
    }

    .provider-logo {
      width: 24px;
      height: 24px;
      border-radius: 4px;
    }

    .no-providers {
      text-align: center;
      padding: 2rem;
      color: #ccc;
    }

    .no-providers mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #666;
      margin-bottom: 1rem;
    }

    .no-providers p {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .no-providers small {
      color: #888;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #ccc;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #e50914;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: white;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
        flex-direction: column;
        gap: 1rem;
      }

      .movie-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .movie-poster {
        width: 150px;
        height: 225px;
      }

      .movie-info h2 {
        font-size: 2rem;
      }

      .search-result-item {
        gap: 0.75rem;
        padding: 0.75rem;
      }

      .result-poster {
        width: 50px;
        height: 75px;
      }
    }
  `]
})
export class PlatformFinderComponent implements OnInit {
  // No-nullable y tipado
  searchControl = new FormControl<string>('', { nonNullable: true });
  searchResults$!: Observable<Movie[]>;
  selectedMovie: Movie | null = null;
  watchProviders: {
    link: string;
    flatrate?: WatchProvider[];
    rent?: WatchProvider[];
    buy?: WatchProvider[];
  } | null = null;
  loadingProviders = false;
  showSearchResults = false;

  constructor(private tmdbService: TMDBService) {}

  ngOnInit(): void {
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchResults$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      tap(term => {
        const hasText = term.trim().length >= 2;
        this.showSearchResults = hasText;
        if (hasText) this.selectedMovie = null; // permite nuevas búsquedas sin refrescar
      }),
      switchMap(term => {
        const q = term.trim();
        return q.length >= 2
          ? this.tmdbService.searchMovies(q)
          : of({ results: [] as Movie[] });
      }),
      map(res => res.results.slice(0, 5))
    );
  }

  selectMovie(movie: Movie): void {
    this.selectedMovie = movie;
    this.showSearchResults = false;
    this.loadWatchProviders(movie.id); // cargar proveedores al seleccionar
  }

  trackByMovieId(_: number, m: Movie) { return m.id; }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!(event.target as HTMLElement).closest('.search-section')) {
      this.showSearchResults = false;
    }
  }

  onSearchFocus(): void {
    const hasText = this.searchControl.value.trim().length >= 2;
    this.showSearchResults = hasText;
    if (hasText) this.selectedMovie = null;
  }

  private loadWatchProviders(movieId: number): void {
    this.loadingProviders = true;
    this.watchProviders = null;

    this.tmdbService.getWatchProviders(movieId).subscribe({
      next: (data) => {
        // Para propósitos de demostración, usar proveedores de España (o US si no hay ES)
        this.watchProviders = data.results?.['ES'] || data.results?.['US'] || null;
        this.loadingProviders = false;
      },
      error: (error) => {
        console.error('Error cargando proveedores de streaming:', error);
        this.loadingProviders = false;
      }
    });
  }

  getImageUrl(posterPath: string | null): string {
    return posterPath ? this.tmdbService.getImageUrl(posterPath) : '';
  }

  getProviderLogo(logoPath: string): string {
    return this.tmdbService.getImageUrl(logoPath, 'w92');
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'Por anunciar';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
