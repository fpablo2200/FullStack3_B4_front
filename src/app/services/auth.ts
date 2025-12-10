import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { LoggerService } from './logger.service';
import { Usuario, LoginCredentials, LoginResponse } from '../models/usuario.model';
import { Sesion } from '../models/sesion.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/usuarios`;
  private platformId = inject(PLATFORM_ID);

  private sesionSubject!: BehaviorSubject<Sesion | null>;
  sesion$!: Observable<Sesion | null>;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private logger: LoggerService
  ) {
    this.sesionSubject = new BehaviorSubject<Sesion | null>(this.getSesion());
    this.sesion$ = this.sesionSubject.asObservable();
  }


 getSesion(): Sesion | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return this.storage.getItem<Sesion>('sesion');
  }

  estaLogueado(): boolean {
    const sesion = this.getSesion();
    return sesion?.logueado || false;
  }

  esAdmin(): boolean {
    const sesion = this.getSesion();
    return sesion?.rol === 'ADMIN';
  }

  iniciarSesion(sesionData: Sesion): void {
    if (isPlatformBrowser(this.platformId)) {
      this.storage.setItem('sesion', sesionData);
    }
    this.sesionSubject.next(sesionData);
  }

  cerrarSesion(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.storage.removeItem('sesion');
    }
    this.sesionSubject.next(null);
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    this.logger.debug('Attempting login', credentials.correo);
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  verificarCorreo(correo: string): Observable<{ existe: boolean }> {
    return this.http.get<{ existe: boolean }>(
      `${this.apiUrl}/verificar-correo?correo=${correo}`
    );
  }

  registrarUsuario(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  obtenerUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }
  
  actualizarUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }
  

}
