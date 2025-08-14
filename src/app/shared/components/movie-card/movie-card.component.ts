import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Movie } from '../../../models/movie.interface';
import { TMDBService } from '../../../services/tmdb.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-card class="movie-card" (click)="onCardClick()">
      <div class="card-image-container">
        <img 
          [src]="posterUrl" 
          [alt]="movie.title"
          class="card-image"
          (error)="onImageError($event)"
        />
        <div class="card-overlay">
          <button 
            mat-icon-button 
            class="play-button"
            (click)="onTrailerClick($event)"
            title="Ver Trailer"
          >
            <mat-icon>play_circle_filled</mat-icon>
          </button>
        </div>
        <div class="rating-badge" *ngIf="movie.vote_average > 0">
          <mat-icon>star</mat-icon>
          <span>{{ movie.vote_average | number:'1.1-1' }}</span>
        </div>
      </div>
      
      <mat-card-content class="card-content">
        <h3 class="movie-title">{{ movie.title }}</h3>
        <p class="release-date">{{ formatDate(movie.release_date) }}</p>
        <p class="movie-overview" *ngIf="showOverview">{{ movie.overview }}</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .movie-card {
      background: rgba(255, 255, 255, 0.05) !important;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .movie-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(229, 9, 20, 0.2);
      border-color: rgba(229, 9, 20, 0.3);
    }

    .card-image-container {
      position: relative;
      width: 100%;
      aspect-ratio: 2/3;
      overflow: hidden;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .movie-card:hover .card-image {
      transform: scale(1.05);
    }

    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .movie-card:hover .card-overlay {
      opacity: 1;
    }

    .play-button {
      background: rgba(229, 9, 20, 0.9) !important;
      color: white !important;
      width: 60px !important;
      height: 60px !important;
      transform: scale(1);
      transition: transform 0.3s ease;
    }

    .play-button:hover {
      transform: scale(1.1);
    }

    .play-button mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .rating-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0, 0, 0, 0.8);
      color: #ffd700;
      padding: 4px 8px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .rating-badge mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .card-content {
      padding: 1rem !important;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .movie-title {
      color: white !important;
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .release-date {
      color: #e50914 !important;
      font-size: 0.9rem;
      margin: 0 0 0.5rem 0;
      font-weight: 500;
    }

    .movie-overview {
      color: #ccc !important;
      font-size: 0.85rem;
      line-height: 1.4;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      flex: 1;
    }

    @media (max-width: 768px) {
      .movie-title {
        font-size: 1rem;
      }
      
      .play-button {
        width: 50px !important;
        height: 50px !important;
      }
      
      .play-button mat-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  `]
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() showOverview: boolean = false;
  @Output() trailerClicked = new EventEmitter<number>();

  constructor(private tmdbService: TMDBService) {}

  get posterUrl(): string {
    return this.tmdbService.getImageUrl(this.movie.poster_path);
  }

  onTrailerClick(event: Event): void {
    event.stopPropagation();
    this.trailerClicked.emit(this.movie.id);
  }

  onCardClick(): void {
    // Navegar a detalle de película - implementado en componente padre
  }

  onImageError(event: any): void {
    event.target.src = 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg';
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