import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { Movie } from '../../models/movie.interface';
import { TMDBService } from '../../services/tmdb.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-upcoming-releases',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MovieCardComponent
  ],
  template: `
    <div class="upcoming-container">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">
            <mat-icon>upcoming</mat-icon>
            Próximos Estrenos
          </h1>
          <p class="page-description">
            Descubre las películas más esperadas que llegarán pronto a los cines
          </p>
        </div>

        <div class="movies-grid" *ngIf="movies.length > 0">
          <app-movie-card
            *ngFor="let movie of movies; trackBy: trackByMovieId"
            [movie]="movie"
            [showOverview]="true"
            (trailerClicked)="onTrailerClick($event)"
          ></app-movie-card>
        </div>

        <div class="loading-container" *ngIf="loading">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Cargando más películas...</p>
        </div>

        <div class="empty-state" *ngIf="!loading && movies.length === 0">
          <mat-icon>movie_filter</mat-icon>
          <h3>No se encontraron próximos estrenos</h3>
          <p>¡Vuelve más tarde para ver nuevos lanzamientos!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upcoming-container {
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

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
      color: #ccc;
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

      .page-title mat-icon {
        font-size: 2.5rem;
        width: 2.5rem;
        height: 2.5rem;
      }

      .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
    }
  `]
})
export class UpcomingReleasesComponent implements OnInit, OnDestroy {
  movies: Movie[] = [];
  loading = false;
  currentPage = 1;
  hasMorePages = true;
  private destroy$ = new Subject<void>();

  constructor(private tmdbService: TMDBService) {}

  ngOnInit(): void {
    this.loadMovies();
    this.setupInfiniteScroll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMovies(): void {
    if (this.loading || !this.hasMorePages) return;

    this.loading = true;
    this.tmdbService.getUpcomingMovies(this.currentPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.movies = [...this.movies, ...response.results];
          this.currentPage++;
          this.hasMorePages = this.currentPage <= response.total_pages;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error cargando películas:', error);
          this.loading = false;
        }
      });
  }

  private setupInfiniteScroll(): void {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 1000;

      if (scrollPosition >= threshold && !this.loading && this.hasMorePages) {
        this.loadMovies();
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Limpiar al destruir
    this.destroy$.subscribe(() => {
      window.removeEventListener('scroll', handleScroll);
    });
  }

  onTrailerClick(movieId: number): void {
    // TODO: Implementar modal de trailer o redirección
    console.log('Ver trailer de la película:', movieId);
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}