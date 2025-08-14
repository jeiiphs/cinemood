import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ranking } from '../models/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private rankings = new BehaviorSubject<Ranking[]>([]);
  public rankings$ = this.rankings.asObservable();

  constructor() {
    this.loadRankings();
  }

  private loadRankings(): void {
    // Load rankings from localStorage for demo purposes
    // In a real app, this would be an HTTP call to your backend
    const stored = localStorage.getItem('cinemood_rankings');
    if (stored) {
      const rankings = JSON.parse(stored).map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt)
      }));
      this.rankings.next(rankings);
    }
  }

  saveRanking(ranking: Omit<Ranking, 'id' | 'createdAt' | 'updatedAt'>): Observable<Ranking> {
    return new Observable(observer => {
      const newRanking: Ranking = {
        ...ranking,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const currentRankings = this.rankings.value;
      const existingIndex = currentRankings.findIndex(
        r => r.sagaId === newRanking.sagaId && r.userId === newRanking.userId
      );

      if (existingIndex >= 0) {
        currentRankings[existingIndex] = { ...newRanking, updatedAt: new Date() };
      } else {
        currentRankings.push(newRanking);
      }

      this.rankings.next(currentRankings);
      this.saveToStorage(currentRankings);
      
      observer.next(newRanking);
      observer.complete();
    });
  }

  getRankingsByMajority(sagaId: string): Observable<number[]> {
    return new Observable(observer => {
      const rankings = this.rankings.value.filter(r => r.sagaId === sagaId);
      
      if (rankings.length === 0) {
        observer.next([]);
        observer.complete();
        return;
      }

      // Calculate average positions for each movie
      const moviePositions: Record<number, number[]> = {};
      
      rankings.forEach(ranking => {
        ranking.movieIds.forEach((movieId, index) => {
          if (!moviePositions[movieId]) {
            moviePositions[movieId] = [];
          }
          moviePositions[movieId].push(index);
        });
      });

      // Calculate average position for each movie
      const averages = Object.entries(moviePositions).map(([movieId, positions]) => ({
        movieId: parseInt(movieId),
        averagePosition: positions.reduce((sum, pos) => sum + pos, 0) / positions.length
      }));

      // Sort by average position
      averages.sort((a, b) => a.averagePosition - b.averagePosition);
      
      const result = averages.map(item => item.movieId);
      observer.next(result);
      observer.complete();
    });
  }

  private saveToStorage(rankings: Ranking[]): void {
    localStorage.setItem('cinemood_rankings', JSON.stringify(rankings));
  }
}