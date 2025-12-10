import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

/**
 * Configuración común para todos los tests
 * Proporciona HttpClient, Router y otros servicios necesarios
 */
export function setupTestBed() {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideRouter(routes)
    ]
  });
}
