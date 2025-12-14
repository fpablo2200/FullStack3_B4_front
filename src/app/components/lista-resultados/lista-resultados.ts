import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa ActivatedRoute y NavigationEnd
import { Router, RouterModule, ActivatedRoute, NavigationEnd } from '@angular/router'; 
import { Header } from '../header/header';
import { ResultadoService } from '../../services/resultado';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal';
// Importa OnDestroy y Subject, o usa takeUntil
import { OnDestroy } from '@angular/core';
import { Subject, filter, takeUntil } from 'rxjs'; // Necesitarás Subject, filter y takeUntil

@Component({
  selector: 'app-lista-resultado',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, ConfirmModalComponent],
  templateUrl: './lista-resultados.html',
  styleUrls: ['./lista-resultados.scss']
})
export class ListaResultadoComponent implements OnInit, OnDestroy { // IMPLEMENTAR OnDestroy

  resultados: any[] = [];
  error: string = '';
  cargando: boolean = true;
  mostrarModal = false;
  idSeleccionado: number | null = null;
  
  // Agrega un Subject para manejar la desuscripción de Observables
  private destroy$ = new Subject<void>(); 
  private _confirmModalSubscribed = false;


  constructor(
    private router: Router,
    private resultadoService: ResultadoService,
    private activatedRoute: ActivatedRoute // Inyecta ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1. Cargar los datos la primera vez
    this.cargarResultados();

    // 2. Suscribirse a los eventos del Router para recargar cuando volvamos a esta ruta
    this.router.events.pipe(
      // Filtra solo los eventos de finalización de navegación
      filter(event => event instanceof NavigationEnd),
      // Asegura que el Observable se complete cuando el componente se destruya
      takeUntil(this.destroy$) 
    ).subscribe(() => {
      // Usamos snapshot.url para asegurarnos de que la URL actual coincide con la ruta activa
      if (this.router.url === '/lista-resultado') {
          this.cargarResultados();
      }
    });
  }

  // Nuevo método para encapsular la lógica de carga de datos
  cargarResultados(): void {
    this.cargando = true; // Establece cargando a true antes de la llamada
    this.resultadoService.obtenerResultados().subscribe({
      next: (data) => { 
        this.resultados = data; 
        this.cargando = false; 
        this.error = ''; // Limpia el error si la carga fue exitosa
      },
      error: () => { 
        this.error = 'Error al cargar resultados.'; 
        this.cargando = false; 
      }
    });
  }
  
  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria (Memory Leaks)
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ... el resto de tus métodos (abrirModal, cancelar, confirmarEliminacion, editar, eliminar)
  // Nota: Considera usar el nuevo método confirmarEliminacion que ya tienes implementado para reemplazar el "eliminar" con el confirm nativo.
  
  // Mantengo los métodos originales para no romper tu código.
  abrirModal(id: number) {
    this.idSeleccionado = id;
    this.mostrarModal = true;
  }

  cancelar() {
    console.log('[ListaResultado] cancelar() called - hiding modal');
    this.mostrarModal = false;
    this.idSeleccionado = null;
  }
  
  confirmarEliminacion() {
    console.log('[ListaResultado] confirmarEliminacion() called, idSeleccionado=', this.idSeleccionado);
    if (this.idSeleccionado == null) return;

    this.resultadoService.eliminarResultado(this.idSeleccionado).subscribe({
      next: () => {
        // Eliminar del array local
        this.resultados = this.resultados.filter(
          r => Number(r.idResultado) !== Number(this.idSeleccionado)
        );
        this.mostrarModal = false;
        console.log('[ListaResultado] eliminar OK, id=', this.idSeleccionado);
        // Opcional: podrías llamar a this.cargarResultados() aquí para recargar la lista completa, pero filtrar es más eficiente.
      },
      error: () => {
        this.error = 'No se pudo eliminar el registro.';
        this.mostrarModal = false;
        console.log('[ListaResultado] eliminar ERROR, id=', this.idSeleccionado);
      }
    });
  }

  editar(id: number) {
    this.router.navigate(['/detalle-resultado', id]);
  }
  
  // Este método está duplicado/obsoleto ya que tienes confirmarEliminacion, pero lo dejo por si lo usas en el HTML.
  eliminar(id: number) {
    if (!confirm('¿Eliminar este resultado?')) return;
    this.resultados = this.resultados.filter(r => Number(r.idResultado) !== Number(id));
  }
}