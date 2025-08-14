import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>CineMood</h3>
            <p>Tu compañero cinematográfico definitivo. Descubre, explora y disfruta de la película perfecta para cada estado de ánimo.</p>
          </div>
          
          <div class="footer-section">
            <h4>Características</h4>
            <ul>
              <li>Próximos Estrenos</li>
              <li>Recomendaciones por Estado de Ánimo</li>
              <li>Rankings de Sagas</li>
              <li>Búsqueda de Plataformas</li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Fuentes de Datos</h4>
            <ul>
              <li>The Movie Database (TMDB)</li>
              <li>API de JustWatch</li>
              <li>Rankings de la Comunidad</li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>Conectar</h4>
            <div class="social-links">
              <a href="#" class="social-link">
                <mat-icon>facebook</mat-icon>
              </a>
              <a href="#" class="social-link">
                <mat-icon>alternate_email</mat-icon>
              </a>
              <a href="#" class="social-link">
                <mat-icon>code</mat-icon>
              </a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 CineMood. Construido con Angular y potenciado por TMDB.</p>
          <p class="footer-disclaimer">Este producto utiliza la API de TMDB pero no está respaldado ni certificado por TMDB.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: rgba(0, 0, 0, 0.9);
      border-top: 1px solid rgba(229, 9, 20, 0.2);
      margin-top: 4rem;
      padding: 2rem 0 1rem;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .footer-section h3 {
      color: #e50914;
      font-size: 1.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .footer-section h4 {
      color: white;
      font-size: 1.1rem;
      margin-bottom: 1rem;
      font-weight: 600;
    }

    .footer-section p {
      color: #ccc;
      line-height: 1.6;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
    }

    .footer-section li {
      color: #ccc;
      margin-bottom: 0.5rem;
      padding-left: 1rem;
      position: relative;
    }

    .footer-section li::before {
      content: '▸';
      color: #e50914;
      position: absolute;
      left: 0;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(229, 9, 20, 0.1);
      border: 1px solid rgba(229, 9, 20, 0.3);
      border-radius: 50%;
      color: #e50914;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .social-link:hover {
      background: #e50914;
      color: white;
      transform: translateY(-2px);
    }

    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: #888;
    }

    .footer-disclaimer {
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .social-links {
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {}