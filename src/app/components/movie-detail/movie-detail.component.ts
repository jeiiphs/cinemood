import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { forkJoin } from 'rxjs';

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
}

interface Cast {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
}

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {
  movie: MovieDetail | null = null;
  credits: Cast | null = null;
  trailer: string | null = null;
  providers: any = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const movieId = Number(params['id']);
      if (isNaN(movieId)) {
        this.router.navigate(['/']);
        return;
      }
      this.loadMovieData(movieId);
    });
  }

  private loadMovieData(movieId: number): void {
    this.loading = true;
    this.error = false;
    
    forkJoin({
      details: this.movieService.getMovieDetails(movieId),
      credits: this.movieService.getMovieCredits(movieId),
      videos: this.movieService.getMovieTrailer(movieId),
      providers: this.movieService.getWatchProviders(movieId)
    }).subscribe({
      next: (data) => {
        this.movie = data.details;
        this.credits = data.credits;
        const trailer = data.videos.results?.find((v: any) => v.type === 'Trailer');
        this.trailer = trailer ? trailer.key : null;
        this.providers = data.providers.results?.['ES'] || null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching movie details:', error);
        this.loading = false;
        this.error = true;
      }
    });
  }
}
