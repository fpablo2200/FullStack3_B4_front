import { Component, OnInit, Inject  } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Header } from '../header/header';
import { ResultadoService  } from '../../services/resultado';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-detalle-resultado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Header],
  templateUrl: './detalle-resultado.html',
  styleUrl: './detalle-resultado.scss',
})
export class DetalleResultado implements OnInit {

  detalleForm!: FormGroup;
  editingId: number | null = null;
  isEdit = false;
  mensaje = '';
  cargando = true;
  error = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private resultadoService: ResultadoService ,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

ngOnInit(): void {
  this.detalleForm = this.fb.group({
    idExamen: ['', Validators.required],
    tipoAnalisis: ['', Validators.required],
    laboratorio: ['', Validators.required],
    valoresResultado: ['', Validators.required],
    observaciones: [''],
    fechaResultado: ['', Validators.required],
    estado: ['', Validators.required]
  });
  

    const idParam = this.route.snapshot.paramMap.get('id');

    // Si viene con ID → estamos editando
    if (idParam) {
      this.editingId = Number(idParam);
      this.isEdit = true;

      this.resultadoService.obtenerPorId(this.editingId).subscribe({
        next: (data) => {
          this.detalleForm.patchValue(data);
          this.cargando = false;
        },
        error: () => {
          this.error = 'No se pudo cargar el resultado.';
          this.cargando = false;
        }
      });
    } else {
      // Caso: nuevo registro
      this.cargando = false;
      this.detalleForm.patchValue({
        fechaResultado: new Date().toISOString()
      });
    }
  }

  guardar() {
    if (this.detalleForm.invalid) {
      this.detalleForm.markAllAsTouched();
      return;
    }

    const datos = this.detalleForm.value;

    if (this.isEdit && this.editingId != null) {
      // actualizar
      this.resultadoService.actualizar(this.editingId, datos).subscribe({
        next: () => {
          this.mensaje = 'Resultado actualizado.';
          this.router.navigate(['/lista-resultado']);
        },
        error: () => this.error = 'Error al actualizar.'
      });
    } else {
      // crear nuevo
      this.resultadoService.crear(datos).subscribe({
        next: () => {
          this.mensaje = 'Resultado creado.';
          this.router.navigate(['/lista-resultado']);
        },
        error: () => this.error = 'Error al crear.'
      });
    }
  }


  cancelar() {
    this.router.navigate(['/lista-resultado']);
  }
  get f() {
    return this.detalleForm.controls;
  }


}
