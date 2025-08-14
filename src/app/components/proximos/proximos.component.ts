import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

@Component({
  selector: 'app-proximos',
  templateUrl: './proximos.component.html',
  styleUrls: ['./proximos.component.scss']
})
export class ProximosComponent implements OnInit {
  peliculas: Movie[] = [];
  trailerKey: string | null = null;
  showModal = false;

  constructor(
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.movieService.getUpcomingMovies().subscribe({
      next: (data) => {
        this.peliculas = data.results;
      },
      error: (error) => {
        console.error('Error fetching upcoming movies:', error);
      }
    });
  }

  openTrailer(movieId: number): void {
    this.movieService.getMovieTrailer(movieId).subscribe({
      next: (data) => {
        const trailer = data.results.find((video: any) => video.type === 'Trailer');
        this.trailerKey = trailer ? trailer.key : null;
        this.showModal = true;
      },
      error: (error) => {
        console.error('Error fetching trailer:', error);
        this.trailerKey = null;
        this.showModal = true;
      }
    });
  }

  navigateToDetails(movieId: number, event: Event): void {
    // Prevenir que se active el trailer si se hace click en el botón de play
    if (!(event.target as HTMLElement).classList.contains('play-button')) {
      this.router.navigate(['/pelicula', movieId]);
    }
  }
}
