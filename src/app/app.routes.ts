import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { ListaResultadoComponent } from './components/lista-resultados/lista-resultados';
import { RegisterComponent } from './components/registro/registro';
import { Recupera } from './components/recupera/recupera';
import { DetalleResultado } from './components/detalle-resultado/detalle-resultado';
import { AdminComponent } from './components/admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'lista-resultado', component: ListaResultadoComponent },
  { path: 'lista-resultado/:id', component: ListaResultadoComponent },
  { path: 'detalle-resultado', component: DetalleResultado },
  { path: 'detalle-resultado/:id', component: DetalleResultado },
  { path: 'registro', component: RegisterComponent },
  { path: 'registro/:id', component: RegisterComponent },
  { path: 'recupera', component: Recupera },
  { path: 'list-usuarios', component: AdminComponent },
  { path: '**', redirectTo: 'login' }
];


export class AppRoutingModule {}