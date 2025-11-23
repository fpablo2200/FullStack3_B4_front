import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/usuarios';
  private platformId = inject(PLATFORM_ID);

  private sesionSubject = new BehaviorSubject<any>(this.getSesion());
  sesion$ = this.sesionSubject.asObservable();

  constructor(private http: HttpClient) {}


 getSesion() {
    if (!isPlatformBrowser(this.platformId)) return null;

    const sesion = localStorage.getItem('sesion');
    return sesion ? JSON.parse(sesion) : null;
  }

  estaLogueado(): boolean {
    const sesion = this.getSesion();
    return sesion?.logueado || false;
  }

  esAdmin(): boolean {
    const sesion = this.getSesion();
    return sesion?.rol === 'ADMIN';   //  <--- CORREGIDO
  }

  iniciarSesion(sesionData: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('sesion', JSON.stringify(sesionData));
    }
    this.sesionSubject.next(sesionData);
  }

  cerrarSesion(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('sesion');
    }
    this.sesionSubject.next(null);
  }

  login(credentials: { correo: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  verificarCorreo(correo: string) {
    return this.http.get<{ existe: boolean }>(
      `http://localhost:8080/usuarios/verificar-correo?correo=${correo}`
    );
  }

  registrarUsuario(usuario: any) {
    return this.http.post('http://localhost:8080/usuarios', usuario);
  }

  obtenerUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  
  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, usuario);
  }
  

}
