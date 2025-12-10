import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  
  /**
   * Log general para debug
   */
  log(message: string, ...args: any[]): void {
    if (!environment.production) {
      console.log(`[LOG] ${message}`, ...args);
    }
  }

  /**
   * Log de información
   */
  info(message: string, ...args: any[]): void {
    if (!environment.production) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  /**
   * Log de advertencia
   */
  warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  /**
   * Log de error
   */
  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error);
    
    // Aquí podrías enviar a un servicio de monitoreo como Sentry
    if (environment.production) {
      // this.sendToMonitoringService(message, error);
    }
  }

  /**
   * Log de debug solo en desarrollo
   */
  debug(message: string, ...args: any[]): void {
    if (!environment.production) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}
