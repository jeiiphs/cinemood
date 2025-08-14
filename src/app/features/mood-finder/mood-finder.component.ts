import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Movie, Mood } from '../../models/movie.interface';
import { MoodService } from '../../services/mood.service';
import { TMDBService } from '../../services/tmdb.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-mood-finder',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MovieCardComponent
  ],
  template: `
    <div class="mood-finder-container">
      <div class="container">
        <!-- Selección de Estado de Ánimo -->
        <div class="mood-selection" *ngIf="!selectedMood">
          <div class="page-header">
            <h1 class="page-title">
              <mat-icon>psychology</mat-icon>
              ¿Cómo te sientes?
            </h1>
            <p class="page-description">
              Elige tu estado de ánimo y te recomendaremos las películas perfectas para tus emociones
            </p>
          </div>

          <div class="moods-grid">
            <div 
              *ngFor="let mood of moods" 
              class="mood-card"
              (click)="selectMood(mood)"
            >
              <div class="mood-icon">
                <mat-icon>{{ mood.icon }}</mat-icon>
              </div>
              <h3>{{ mood.name }}</h3>
              <p>{{ mood.description }}</p>
            </div>
          </div>
        </div>

        <!-- Resultados del Estado de Ánimo Seleccionado -->
        <div class="mood-results" *ngIf="selectedMood">
          <div class="results-header">
            <button mat-icon-button class="back-button" (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <div class="selected-mood-info">
              <mat-icon class="mood-icon">{{ selectedMood.icon }}</mat-icon>
              <div>
                <h1>Películas para cuando estás {{ selectedMood.name }}</h1>
                <p>{{ selectedMood.description }}</p>
              </div>
            </div>
          </div>

          <div class="loading-container" *ngIf="loading">
            <mat-spinner diameter="50"></mat-spinner>
            <p>Encontrando películas que coincidan con tu estado de ánimo...</p>
          </div>

          <div class="movies-grid" *ngIf="recommendedMovies.length > 0 && !loading">
            <app-movie-card
              *ngFor="let movie of recommendedMovies"
              [movie]="movie"
              [showOverview]="true"
              (trailerClicked)="onTrailerClick($event)"
            ></app-movie-card>
          </div>

          <div class="empty-state" *ngIf="!loading && recommendedMovies.length === 0">
            <mat-icon>movie_filter</mat-icon>
            <h3>No se encontraron películas para este estado de ánimo</h3>
            <p>¡Intenta seleccionar un estado de ánimo diferente o vuelve más tarde!</p>
            <button mat-raised-button class="btn btn-primary" (click)="goBack()">
              Elegir Otro Estado de Ánimo
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mood-finder-container {
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

    .moods-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .mood-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .mood-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(229, 9, 20, 0.1), transparent);
      transition: left 0.5s ease;
    }

    .mood-card:hover {
      transform: translateY(-8px);
      border-color: rgba(229, 9, 20, 0.3);
      box-shadow: 0 20px 40px rgba(229, 9, 20, 0.2);
    }

    .mood-card:hover::before {
      left: 100%;
    }

    .mood-icon {
      margin-bottom: 1.5rem;
    }

    .mood-icon mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #e50914;
    }

    .mood-card h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: white;
      font-weight: 600;
    }

    .mood-card p {
      color: #ccc;
      font-size: 1rem;
      line-height: 1.4;
    }

    .results-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .back-button {
      background: rgba(229, 9, 20, 0.1) !important;
      color: #e50914 !important;
      border: 1px solid rgba(229, 9, 20, 0.3);
    }

    .selected-mood-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .selected-mood-info .mood-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #e50914;
    }

    .selected-mood-info h1 {
      font-size: 2.5rem;
      color: white;
      margin: 0;
    }

    .selected-mood-info p {
      color: #ccc;
      margin: 0;
      font-size: 1.1rem;
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 4rem 2rem;
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

    .empty-state p {
      margin-bottom: 2rem;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
        flex-direction: column;
        gap: 1rem;
      }

      .moods-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }

      .results-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .selected-mood-info {
        flex-direction: column;
        text-align: center;
      }

      .selected-mood-info h1 {
        font-size: 2rem;
      }

      .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
      }
    }
  `]
})
export class MoodFinderComponent implements OnInit {
  moods: Mood[] = [];
  selectedMood: Mood | null = null;
  recommendedMovies: Movie[] = [];
  loading = false;

  constructor(
    private moodService: MoodService,
    private tmdbService: TMDBService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.moods = this.moodService.getMoods();
    
    // Verificar si se proporciona un estado de ánimo en los parámetros de consulta
    this.route.queryParams.subscribe(params => {
      if (params['mood']) {
        const mood = this.moodService.getMoodById(params['mood']);
        if (mood) {
          this.selectMood(mood);
        }
      }
    });
  }

  selectMood(mood: Mood): void {
    this.selectedMood = mood;
    this.loading = true;
    this.recommendedMovies = [];

    // Actualizar URL con el estado de ánimo seleccionado
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { mood: mood.id },
      queryParamsHandling: 'merge'
    });

    this.tmdbService.findByMood(mood.id).subscribe({
      next: (movies) => {
        this.recommendedMovies = movies;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando películas por estado de ánimo:', error);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.selectedMood = null;
    this.recommendedMovies = [];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: 'replace'
    });
  }

  onTrailerClick(movieId: number): void {
    // TODO: Implementar modal de trailer o redirección
    console.log('Ver trailer de la película:', movieId);
  }
}