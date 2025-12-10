import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoggerService } from './logger.service';
import { Resultado } from '../models/resultado.model';

@Injectable({
  providedIn: 'root',
})
export class ResultadoService  {
  private apiUrl = `${environment.resultadosUrl}/resultados`;

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {}


  obtenerResultados(): Observable<Resultado[]> {
    this.logger.debug('Fetching all resultados');
    return this.http.get<Resultado[]>(this.apiUrl);
  }


  obtenerPorId(id: number): Observable<Resultado> {
    this.logger.debug(`Fetching resultado with id: ${id}`);
    return this.http.get<Resultado>(`${this.apiUrl}/${id}`);
  }


  crear(data: Partial<Resultado>): Observable<Resultado> {
    this.logger.debug('Creating new resultado');
    return this.http.post<Resultado>(this.apiUrl, data);
  }


  actualizar(id: number, data: Partial<Resultado>): Observable<Resultado> {
    this.logger.debug(`Updating resultado with id: ${id}`);
    return this.http.put<Resultado>(`${this.apiUrl}/${id}`, data);
  }


  eliminarResultado(id: number): Observable<void> {
    this.logger.debug(`Deleting resultado with id: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
