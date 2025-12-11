
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnInit {
  rol: string | null = null;
  constructor(private router: Router) {}

   ngOnInit() {
    const sesion = localStorage.getItem('sesion');

    if (sesion) {
      const data = JSON.parse(sesion);
      this.rol = data.rol;
    }
  }

  goToLista() {
    this.router.navigate(['/lista-resultado']);
  }

  logout() {
    // limpiar sesión y navegar a login
    localStorage.removeItem('sesion');
    this.router.navigate(['/login']);
  }

}
