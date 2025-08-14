import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../../models/movie.interface';
import { TMDBService } from '../../services/tmdb.service';
import { MoodService } from '../../services/mood.service';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MovieCardComponent
  ],
  template: `
    <div class="home-container">
      <!-- Sección Hero -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">CineMood</span>
          </h1>
          <p class="hero-subtitle">Tu próxima película está a solo una emoción de distancia</p>
          <p class="hero-description">
            Descubre la película perfecta para cada emoción, explora próximos estrenos, 
            y encuentra exactamente dónde ver tus favoritas.
          </p>
          <div class="hero-actions">
            <button mat-raised-button class="btn btn-primary" routerLink="/mood-finder">
              <mat-icon>psychology</mat-icon>
              Encuentra mi Estado de Ánimo
            </button>
            <button mat-raised-button class="btn btn-secondary" routerLink="/upcoming">
              <mat-icon>upcoming</mat-icon>
              Próximos Estrenos
            </button>
          </div>
        </div>
        <div class="hero-background">
          <div class="gradient-overlay"></div>
        </div>
      </section>

      <!-- Próximos Estrenos Destacados -->
      <section class="featured-section">
        <div class="container">
          <h2 class="section-title">
            <mat-icon>upcoming</mat-icon>
            Próximamente
          </h2>
          <div class="featured-grid" *ngIf="upcomingMovies$ | async as movies">
            <app-movie-card
              *ngFor="let movie of movies.slice(0, 6)"
              [movie]="movie"
              [showOverview]="true"
              (trailerClicked)="onTrailerClick($event)"
            ></app-movie-card>
          </div>
          <div class="section-actions">
            <button mat-raised-button routerLink="/upcoming" class="btn btn-primary">
              Ver Todos los Próximos Estrenos
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>
        </div>
      </section>

      <!-- Selector de Estado de Ánimo -->
      <section class="mood-section">
        <div class="container">
          <h2 class="section-title">
            <mat-icon>psychology</mat-icon>
            ¿Cómo te sientes hoy?
          </h2>
          <p class="section-description">
            Deja que tus emociones te guíen hacia la experiencia cinematográfica perfecta
          </p>
          <div class="mood-grid">
            <div 
              *ngFor="let mood of moods" 
              class="mood-card"
              (click)="onMoodSelect(mood.id)"
            >
              <div class="mood-icon">
                <mat-icon>{{ mood.icon }}</mat-icon>
              </div>
              <h3>{{ mood.name }}</h3>
              <p>{{ mood.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Acciones Rápidas -->
      <section class="actions-section">
        <div class="container">
          <div class="actions-grid">
            <div class="action-card" routerLink="/ranking">
              <mat-icon>leaderboard</mat-icon>
              <h3>Rankings de Sagas</h3>
              <p>Vota por tus series de películas favoritas y ve cómo se clasifican globalmente</p>
            </div>
            <div class="action-card" routerLink="/platform-finder">
              <mat-icon>search</mat-icon>
              <h3>Dónde Ver</h3>
              <p>Encuentra en qué plataforma de streaming está tu película o serie deseada</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
    }

    .hero-section {
      position: relative;
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      overflow: hidden;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg') center/cover;
      z-index: -2;
    }

    .gradient-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.8) 0%,
        rgba(26, 26, 46, 0.7) 50%,
        rgba(22, 33, 62, 0.8) 100%
      );
      z-index: -1;
    }

    .hero-content {
      max-width: 800px;
      padding: 2rem;
      z-index: 1;
    }

    .hero-title {
      font-size: 4rem;
      font-weight: 700;
      margin-bottom: 1rem;
      line-height: 1.1;
    }

    .gradient-text {
      background: linear-gradient(45deg, #e50914, #b81d24, #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      color: #e50914;
      margin-bottom: 1rem;
      font-weight: 500;
      font-style: italic;
    }

    .hero-description {
      font-size: 1.1rem;
      color: #ccc;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .featured-section,
    .mood-section,
    .actions-section {
      padding: 4rem 0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 2.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: white;
    }

    .section-title mat-icon {
      color: #e50914;
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    .section-description {
      font-size: 1.1rem;
      color: #ccc;
      margin-bottom: 2rem;
      text-align: center;
    }

    .featured-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .section-actions {
      text-align: center;
      margin-top: 3rem;
    }

    .mood-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .mood-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .mood-card:hover {
      transform: translateY(-5px);
      border-color: rgba(229, 9, 20, 0.3);
      box-shadow: 0 15px 30px rgba(229, 9, 20, 0.1);
    }

    .mood-icon {
      margin-bottom: 1rem;
    }

    .mood-icon mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #e50914;
    }

    .mood-card h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
      color: white;
    }

    .mood-card p {
      color: #ccc;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .action-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      color: inherit;
    }

    .action-card:hover {
      transform: translateY(-5px);
      border-color: rgba(229, 9, 20, 0.3);
      box-shadow: 0 15px 30px rgba(229, 9, 20, 0.1);
    }

    .action-card mat-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: #e50914;
      margin-bottom: 1rem;
    }

    .action-card h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
      color: white;
    }

    .action-card p {
      color: #ccc;
      font-size: 0.9rem;
      line-height: 1.4;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1.2rem;
      }

      .hero-description {
        font-size: 1rem;
      }

      .hero-actions {
        flex-direction: column;
        align-items: center;
      }

      .featured-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }

      .mood-grid,
      .actions-grid {
        grid-template-columns: 1fr;
      }

      .section-title {
        font-size: 2rem;
        text-align: center;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  upcomingMovies$!: Observable<Movie[]>;
  moods: any[] = [];

  constructor(
    private tmdbService: TMDBService,
    private moodService: MoodService
  ) {}

  ngOnInit(): void {
    this.loadUpcomingMovies();
    this.loadMoods();
  }

  private loadUpcomingMovies(): void {
    this.upcomingMovies$ = this.tmdbService.getUpcomingMovies().pipe(
      map(response => response.results)
    );
  }

  private loadMoods(): void {
    this.moods = this.moodService.getMoods();
  }

  onTrailerClick(movieId: number): void {
    // TODO: Implementar modal de trailer o redirección
    console.log('Ver trailer de la película:', movieId);
  }

  onMoodSelect(moodId: string): void {
    // Navegar al buscador de estado de ánimo con el estado seleccionado
    window.location.href = `/mood-finder?mood=${moodId}`;
  }
}