import { Injectable } from '@angular/core';
import { Mood } from '../models/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private moods: Mood[] = [
    {
      id: 'feliz',
      name: 'Feliz',
      icon: 'sentiment_very_satisfied',
      description: 'Películas que alegran el día y levantan el ánimo',
      genres: [35, 10751], // Comedia, Familia
      keywords: ['comedia', 'alegre', 'divertido']
    },
    {
      id: 'triste',
      name: 'Emocional',
      icon: 'sentiment_very_dissatisfied',
      description: 'Historias profundas y conmovedoras que tocan el corazón',
      genres: [18, 10749], // Drama, Romance
      keywords: ['drama', 'emocional', 'conmovedor']
    },
    {
      id: 'emocionado',
      name: 'Emocionado',
      icon: 'local_fire_department',
      description: 'Acción y aventura llena de energía',
      genres: [28, 12, 878], // Acción, Aventura, Ciencia Ficción
      keywords: ['acción', 'aventura', 'emocionante']
    },
    {
      id: 'asustado',
      name: 'Asustado',
      icon: 'psychology',
      description: 'Terror escalofriante y thrillers',
      genres: [27, 9648], // Terror, Thriller
      keywords: ['terror', 'thriller', 'miedo']
    },
    {
      id: 'romantico',
      name: 'Romántico',
      icon: 'favorite',
      description: 'Historias de amor y comedias románticas',
      genres: [10749, 35], // Romance, Comedia
      keywords: ['romance', 'amor', 'romántico']
    },
    {
      id: 'aventurero',
      name: 'Aventurero',
      icon: 'explore',
      description: 'Viajes épicos y grandes aventuras',
      genres: [12, 28], // Aventura, Acción
      keywords: ['aventura', 'viaje', 'épico']
    },
    {
      id: 'reflexivo',
      name: 'Reflexivo',
      icon: 'school',
      description: 'Dramas inteligentes y documentales',
      genres: [18, 99, 36], // Drama, Documental, Historia
      keywords: ['inteligente', 'reflexivo', 'documental']
    },
    {
      id: 'nostalgico',
      name: 'Nostálgico',
      icon: 'history',
      description: 'Películas clásicas y de época',
      genres: [18, 10751], // Drama, Familia
      keywords: ['clásico', 'nostálgico', 'época']
    }
  ];

  getMoods(): Mood[] {
    return this.moods;
  }

  getMoodById(id: string): Mood | undefined {
    return this.moods.find(mood => mood.id === id);
  }

  getMoodByName(name: string): Mood | undefined {
    return this.moods.find(mood => mood.name.toLowerCase() === name.toLowerCase());
  }
}