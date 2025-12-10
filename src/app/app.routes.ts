import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ListaResultadoComponent } from './components/lista-resultados/lista-resultados';
import { RegisterComponent } from './components/registro/registro';
import { Recupera } from './components/recupera/recupera';
import { DetalleResultado } from './components/detalle-resultado/detalle-resultado';
import { AdminComponent } from './components/admin/admin';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'recupera', component: Recupera },
  
  // Rutas privadas (protegidas)
  { path: 'lista-resultado', component: ListaResultadoComponent, canActivate: [authGuard] },
  { path: 'lista-resultado/:id', component: ListaResultadoComponent, canActivate: [authGuard] },
  { path: 'detalle-resultado', component: DetalleResultado, canActivate: [authGuard] },
  { path: 'detalle-resultado/:id', component: DetalleResultado, canActivate: [authGuard] },
  { path: 'list-usuarios', component: AdminComponent, canActivate: [authGuard] },
  
  { path: '**', redirectTo: 'login' }
];


export class AppRoutingModule {}