
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Sesion } from '../../models/sesion.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  rol: string | null = null;
  constructor(
    private router: Router,
    private storage: StorageService
  ) {}

   ngOnInit() {
    const sesion = this.storage.getItem<Sesion>('sesion');

    if (sesion) {
      this.rol = sesion.rol;
    }
  }

  goToLista() {
    this.router.navigate(['/lista-resultado']);
  }

  logout() {
    // limpiar sesión y navegar a login
    this.storage.removeItem('sesion');
    this.router.navigate(['/login']);
  }

}
