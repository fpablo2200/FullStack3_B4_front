import { Component, OnInit } from '@angular/core';
import { Header } from '../header/header';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
  standalone: true,
  imports: [ Header, RouterModule, CommonModule],
})
export class AdminComponent implements OnInit {
  usuarios: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarUsuariosDesdeAPI();
  }

  editar(id: number) {
    this.router.navigate(['/registro', id]);
  }

  cargarUsuariosDesdeAPI() {
    this.http.get<any[]>('http://localhost:8080/usuarios')
      .subscribe({
        next: (data) => {
          this.usuarios = data;
        },
        error: (err) => {
          console.error('Error al cargar usuarios', err);
        }
      });
  }
}
