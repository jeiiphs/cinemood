import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Movie } from '../../models/movie.interface';
import { RankingService } from '../../services/ranking.service';
import { TMDBService } from '../../services/tmdb.service';

@Component({
  selector: 'app-saga-ranking',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  template: `
    <div class="ranking-container">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">
            <mat-icon>leaderboard</mat-icon>
            Ranking de la Saga Star Wars
          </h1>
          <p class="page-description">
            Arrastra y suelta para clasificar las películas de Star Wars en tu orden preferido, ¡luego envía para ver el ranking global!
          </p>
        </div>

        <div class="ranking-content">
          <div class="user-ranking">
            <h2>
              <mat-icon>person</mat-icon>
              Tu Ranking
            </h2>
            <p class="section-description">Arrastra las películas para reordenarlas según tu preferencia</p>
            
            <div 
              cdkDropList 
              class="ranking-list"
              (cdkDropListDropped)="drop($event)"
            >
              <div 
                *ngFor="let movie of userRanking; let i = index" 
                class="ranking-item"
                cdkDrag
              >
                <div class="rank-number">{{ i + 1 }}</div>
                <div class="movie-poster">
                  <img [src]="getImageUrl(movie.poster_path)" [alt]="movie.title" />
                </div>
                <div class="movie-info">
                  <h3>{{ movie.title }}</h3>
                  <p>{{ formatDate(movie.release_date) }}</p>
                  <div class="rating">
                    <mat-icon>star</mat-icon>
                    <span>{{ movie.vote_average | number:'1.1-1' }}</span>
                  </div>
                </div>
                <div class="drag-handle" cdkDragHandle>
                  <mat-icon>drag_indicator</mat-icon>
                </div>
              </div>
            </div>

            <div class="ranking-actions">
              <button 
                mat-raised-button 
                class="btn btn-primary"
                (click)="submitRanking()"
                [disabled]="submitting"
              >
                <mat-icon>send</mat-icon>
                {{ submitting ? 'Enviando...' : 'Enviar Mi Ranking' }}
              </button>
              <button 
                mat-raised-button 
                class="btn btn-secondary"
                (click)="resetRanking()"
              >
                <mat-icon>refresh</mat-icon>
                Reiniciar
              </button>
            </div>
          </div>

          <div class="global-ranking">
            <h2>
              <mat-icon>public</mat-icon>
              Ranking Global
            </h2>
            <p class="section-description">Ranking promedio basado en todos los votos de usuarios</p>
            
            <div class="ranking-list global">
              <div 
                *ngFor="let movie of globalRanking; let i = index" 
                class="ranking-item global-item"
              >
                <div class="rank-number global-rank">{{ i + 1 }}</div>
                <div class="movie-poster">
                  <img [src]="getImageUrl(movie.poster_path)" [alt]="movie.title" />
                </div>
                <div class="movie-info">
                  <h3>{{ movie.title }}</h3>
                  <p>{{ formatDate(movie.release_date) }}</p>
                  <div class="rating">
                    <mat-icon>star</mat-icon>
                    <span>{{ movie.vote_average | number:'1.1-1' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ranking-container {
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
      max-width: 800px;
      margin: 0 auto;
    }

    .ranking-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    .user-ranking,
    .global-ranking {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 2rem;
    }

    .user-ranking h2,
    .global-ranking h2 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: white;
    }

    .user-ranking h2 mat-icon {
      color: #e50914;
    }

    .global-ranking h2 mat-icon {
      color: #4CAF50;
    }

    .section-description {
      color: #ccc;
      margin-bottom: 2rem;
      font-size: 0.9rem;
    }

    .ranking-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .ranking-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 1rem;
      transition: all 0.3s ease;
    }

    .ranking-item:hover {
      border-color: rgba(229, 9, 20, 0.3);
      transform: translateX(5px);
    }

    .ranking-item.cdk-drag-dragging {
      transform: rotate(5deg);
      box-shadow: 0 10px 30px rgba(229, 9, 20, 0.3);
      z-index: 1000;
    }

    .ranking-item.global-item {
      cursor: default;
    }

    .ranking-item.global-item:hover {
      transform: none;
      border-color: rgba(76, 175, 80, 0.3);
    }

    .rank-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: linear-gradient(45deg, #e50914, #b81d24);
      color: white;
      border-radius: 50%;
      font-weight: bold;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .global-rank {
      background: linear-gradient(45deg, #4CAF50, #388E3C);
    }

    .movie-poster {
      width: 60px;
      height: 90px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .movie-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .movie-info {
      flex: 1;
    }

    .movie-info h3 {
      color: white;
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .movie-info p {
      color: #ccc;
      margin: 0 0 0.5rem 0;
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

    .drag-handle {
      color: #666;
      cursor: grab;
      padding: 0.5rem;
    }

    .drag-handle:active {
      cursor: grabbing;
    }

    .ranking-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .cdk-drop-list-dragging .ranking-item:not(.cdk-drag-dragging) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    @media (max-width: 768px) {
      .ranking-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .page-title {
        font-size: 2rem;
        flex-direction: column;
        gap: 1rem;
      }

      .ranking-item {
        gap: 0.5rem;
        padding: 0.75rem;
      }

      .movie-poster {
        width: 50px;
        height: 75px;
      }

      .rank-number {
        width: 30px;
        height: 30px;
        font-size: 1rem;
      }

      .movie-info h3 {
        font-size: 1rem;
      }

      .ranking-actions {
        flex-direction: column;
      }
    }
  `]
})
export class SagaRankingComponent implements OnInit {
  userRanking: Movie[] = [];
  globalRanking: Movie[] = [];
  submitting = false;

  // IDs de películas de la saga Star Wars (TMDB)
  private starWarsMovieIds = [11, 1891, 1892, 1893, 1894, 140607, 181808, 330459, 348350];

  constructor(
    private rankingService: RankingService,
    private tmdbService: TMDBService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStarWarsMovies();
    this.loadGlobalRanking();
  }

  private loadStarWarsMovies(): void {
    // Cargar películas de Star Wars para ranking
    // En una aplicación real, cargarías estas desde la API
    // Para propósitos de demostración, usaremos datos simulados
    this.userRanking = [
      {
        id: 11,
        title: "Star Wars: Episodio IV - Una Nueva Esperanza",
        release_date: "1977-05-25",
        poster_path: "/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
        vote_average: 8.6,
        overview: "",
        backdrop_path: "",
        vote_count: 0,
        genre_ids: [],
        popularity: 0,
        adult: false,
        video: false,
        original_language: "",
        original_title: ""
      },
      {
        id: 1891,
        title: "Star Wars: Episodio V - El Imperio Contraataca",
        release_date: "1980-05-17",
        poster_path: "/2l05cFWJacyIsTpsqSgH0wQXe4V.jpg",
        vote_average: 8.7,
        overview: "",
        backdrop_path: "",
        vote_count: 0,
        genre_ids: [],
        popularity: 0,
        adult: false,
        video: false,
        original_language: "",
        original_title: ""
      },
      {
        id: 1892,
        title: "Star Wars: Episodio VI - El Retorno del Jedi",
        release_date: "1983-05-25",
        poster_path: "/3IMDbj0VKIri9Dx5VjVVbR5sNbz.jpg",
        vote_average: 8.0,
        overview: "",
        backdrop_path: "",
        vote_count: 0,
        genre_ids: [],
        popularity: 0,
        adult: false,
        video: false,
        original_language: "",
        original_title: ""
      },
      {
        id: 1893,
        title: "Star Wars: Episodio I - La Amenaza Fantasma",
        release_date: "1999-05-19",
        poster_path: "/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg",
        vote_average: 6.5,
        overview: "",
        backdrop_path: "",
        vote_count: 0,
        genre_ids: [],
        popularity: 0,
        adult: false,
        video: false,
        original_language: "",
        original_title: ""
      },
      {
        id: 140607,
        title: "Star Wars: El Despertar de la Fuerza",
        release_date: "2015-12-15",
        poster_path: "/wqnLdwVXoBjKibFRR5U3y0aDUhs.jpg",
        vote_average: 7.3,
        overview: "",
        backdrop_path: "",
        vote_count: 0,
        genre_ids: [],
        popularity: 0,
        adult: false,
        video: false,
        original_language: "",
        original_title: ""
      }
    ];

    // Inicializar ranking global con el mismo orden inicialmente
    this.globalRanking = [...this.userRanking];
  }

  private loadGlobalRanking(): void {
    this.rankingService.getRankingsByMajority('star-wars').subscribe({
      next: (rankedIds) => {
        if (rankedIds.length > 0) {
          // Reordenar globalRanking basado en el voto mayoritario
          this.globalRanking = rankedIds
            .map(id => this.userRanking.find(movie => movie.id === id))
            .filter(movie => movie !== undefined) as Movie[];
        }
      },
      error: (error) => {
        console.error('Error cargando ranking global:', error);
      }
    });
  }

  drop(event: CdkDragDrop<Movie[]>): void {
    moveItemInArray(this.userRanking, event.previousIndex, event.currentIndex);
  }

  submitRanking(): void {
    this.submitting = true;
    
    const ranking = {
      sagaId: 'star-wars',
      movieIds: this.userRanking.map(movie => movie.id),
      userId: 'usuario-anonimo' // En una aplicación real, este sería el ID de usuario real
    };

    this.rankingService.saveRanking(ranking).subscribe({
      next: () => {
        this.submitting = false;
        this.snackBar.open('¡Tu ranking ha sido enviado!', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadGlobalRanking(); // Actualizar ranking global
      },
      error: (error) => {
        this.submitting = false;
        this.snackBar.open('Error al enviar el ranking. Por favor, inténtalo de nuevo.', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        console.error('Error enviando ranking:', error);
      }
    });
  }

  resetRanking(): void {
    this.loadStarWarsMovies(); // Reiniciar al orden original
    this.snackBar.open('El ranking ha sido reiniciado', 'Cerrar', {
      duration: 2000
    });
  }

  getImageUrl(posterPath: string): string {
    return this.tmdbService.getImageUrl(posterPath);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Por anunciar';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}