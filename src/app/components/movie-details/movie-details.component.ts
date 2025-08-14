import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  movie: any;
  credits: any;
  videos: any;
  similarMovies: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadMovieData(id);
    });
  }

  private loadMovieData(id: number) {
    this.loading = true;
    forkJoin({
      details: this.movieService.getMovieDetails(id),
      credits: this.movieService.getMovieCredits(id),
      videos: this.movieService.getMovieVideos(id),
      similar: this.movieService.getSimilarMovies(id)
    }).subscribe({
      next: (data) => {
        this.movie = data.details;
        this.credits = data.credits;
        this.videos = data.videos;
        this.similarMovies = data.similar;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando datos de la película:', error);
        this.loading = false;
      }
    });
  }
}
