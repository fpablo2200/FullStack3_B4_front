import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  editMode: boolean = false;   
  editingId: number | null = null;
  userId!: number;         
  error: string = '';
  exito: string = '';
  cargando = true;
  rol: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      password2: [''],
      estado: ['1'],
      rol: ['']
    }, { validators: [this.passwordsIgualesValidator] });

    const sesion = localStorage.getItem('sesion');

    if (sesion) {
      const data = JSON.parse(sesion);
      this.rol = data.rol;
    }

    const idParam = this.route.snapshot.paramMap.get('id');

    // Si viene con ID → estamos editando
    if (idParam) {
      this.editingId = Number(idParam);
      this.editMode = true;

      this.authService.obtenerUsuario(this.editingId).subscribe({
        next: (data) => {
          this.registerForm.patchValue(data);
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
      this.registerForm.patchValue({
        fechaResultado: new Date().toISOString()
      });
    }
  }

  cargarDatosUsuario(id: number) {
    this.authService.obtenerUsuario(id).subscribe({
      next: (usuario) => {
        this.registerForm.patchValue({
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          correo: usuario.correo
        });

        this.registerForm.get('password')?.clearValidators();
        this.registerForm.get('password2')?.clearValidators();
        this.registerForm.get('password')?.updateValueAndValidity();
        this.registerForm.get('password2')?.updateValueAndValidity();
      },
      error: () => {
        this.error = 'Error al cargar datos del usuario.';
      }
    });
  }

  passwordsIgualesValidator(group: AbstractControl): ValidationErrors | null {
    const pass1 = group.get('password')?.value;
    const pass2 = group.get('password2')?.value;
    return pass1 === pass2 ? null : { contrasenasNoCoinciden: true };
  }

  registrar() {
    this.error = '';
    this.exito = '';

    if (this.registerForm.invalid) {
      this.error = 'Revisa los campos, hay errores en el formulario.';
      this.registerForm.markAllAsTouched();
      return;
    }

    const { nombre, apellido, correo, password } = this.registerForm.value;

    let rolActual = null;
    const sesion = localStorage.getItem('sesion');
    if (sesion) {
      rolActual = JSON.parse(sesion).rol;
    }

    if (this.editMode) {

  
      const datos = this.registerForm.value;
  
      this.authService.actualizarUsuario(this.editingId!, datos)
        .subscribe({
          next: () => {
            this.exito = 'Usuario actualizado con éxito.';
            setTimeout(() => this.router.navigate(['/list-usuarios']), 1500);
          },
          error: () => this.error = 'Error al actualizar usuario.'
        });
  
      return;
    }


    this.authService.verificarCorreo(correo).subscribe({
      next: (respuesta) => {
        if (respuesta.existe) {
          this.error = 'El correo ya está registrado.';
          return;
        }

        const nuevoUsuario = {
          nombre,
          apellido,
          correo,
          password,
          rol: "USER",
          estado: "1"
        };

        this.authService.registrarUsuario(nuevoUsuario).subscribe({
          next: () => {
            this.exito = 'Usuario registrado con éxito. Redirigiendo...';
             setTimeout(() => {
            if (rolActual === 'ADMIN') {
              this.router.navigate(['/list-usuarios']);
            } else {
              this.router.navigate(['/login']);
            }
          }, 1500);
          },
          error: (err) => {
            console.error(err);
            this.error = 'Hubo un error al registrar el usuario.';
          }
        });
      },

      error: () => {
        this.error = 'Error al verificar el correo.';
      }
    });
  }

  get f() {
    return this.registerForm.controls;
  }
}
