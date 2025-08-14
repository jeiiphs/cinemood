import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <a routerLink="/" class="brand-link">
            <mat-icon class="brand-icon">movie</mat-icon>
            <span class="brand-text">CineMood</span>
          </a>
          <span class="brand-tagline">Tu próxima película está a solo una emoción de distancia</span>
        </div>
        
        <nav class="navbar-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            <mat-icon>home</mat-icon>
            <span>Inicio</span>
          </a>
          <a routerLink="/upcoming" routerLinkActive="active" class="nav-link">
            <mat-icon>upcoming</mat-icon>
            <span>Próximos</span>
          </a>
          <a routerLink="/mood-finder" routerLinkActive="active" class="nav-link">
            <mat-icon>psychology</mat-icon>
            <span>Estado de Ánimo</span>
          </a>
          <a routerLink="/ranking" routerLinkActive="active" class="nav-link">
            <mat-icon>leaderboard</mat-icon>
            <span>Rankings</span>
          </a>
          <a routerLink="/platform-finder" routerLinkActive="active" class="nav-link">
            <mat-icon>search</mat-icon>
            <span>Dónde Ver</span>
          </a>
        </nav>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      background: rgba(0, 0, 0, 0.9) !important;
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(229, 9, 20, 0.2);
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 80px;
    }

    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .navbar-brand {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .brand-icon {
      color: #e50914;
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
    }

    .brand-text {
      background: linear-gradient(45deg, #e50914, #b81d24);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-tagline {
      font-size: 0.7rem;
      color: #888;
      font-style: italic;
      margin-left: 2.5rem;
    }

    .navbar-nav {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      text-decoration: none;
      color: #ccc;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .nav-link:hover {
      color: white;
      background: rgba(229, 9, 20, 0.1);
      transform: translateY(-2px);
    }

    .nav-link.active {
      color: #e50914;
      background: rgba(229, 9, 20, 0.1);
      border: 1px solid rgba(229, 9, 20, 0.3);
    }

    .nav-link mat-icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }

    @media (max-width: 768px) {
      .navbar-container {
        flex-direction: column;
        gap: 1rem;
        padding: 0.5rem;
      }

      .navbar {
        height: auto;
        padding: 1rem 0;
      }

      .brand-tagline {
        display: none;
      }

      .navbar-nav {
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: center;
      }

      .nav-link span {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {}