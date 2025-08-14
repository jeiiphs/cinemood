import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'upcoming',
    loadComponent: () => import('./features/upcoming-releases/upcoming-releases.component').then(m => m.UpcomingReleasesComponent)
  },
  {
    path: 'mood-finder',
    loadComponent: () => import('./features/mood-finder/mood-finder.component').then(m => m.MoodFinderComponent)
  },
  {
    path: 'ranking',
    loadComponent: () => import('./features/saga-ranking/saga-ranking.component').then(m => m.SagaRankingComponent)
  },
  {
    path: 'platform-finder',
    loadComponent: () => import('./features/platform-finder/platform-finder.component').then(m => m.PlatformFinderComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];