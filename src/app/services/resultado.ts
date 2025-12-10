import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResultadoService  {
  private apiUrl = 'http://localhost:9090/resultados';

  constructor(private http: HttpClient) {}


  obtenerResultados(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


  obtenerPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }


  crear(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }


  actualizar(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }


  eliminarResultado(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

}
