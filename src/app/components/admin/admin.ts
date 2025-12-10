import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoggerService } from '../../services/logger.service';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
  standalone: true,
  imports: [ Header, RouterModule, CommonModule],
})
export class AdminComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.cargarUsuariosDesdeAPI();
  }

  editar(id: number) {
    this.router.navigate(['/registro', id]);
  }

  cargarUsuariosDesdeAPI() {
    this.http.get<Usuario[]>(`${environment.apiUrl}/usuarios`)
      .subscribe({
        next: (data) => {
          this.usuarios = data;
        },
        error: (err) => {
          this.logger.error('Error al cargar usuarios', err);
        }
      });
  }
}
