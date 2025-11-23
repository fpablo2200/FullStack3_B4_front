import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {

  private platformId = inject(PLATFORM_ID);

  loginForm!: FormGroup;
  error: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    this.error = false;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (!isPlatformBrowser(this.platformId)) return;

    this.loading = true;

    const { email, password } = this.loginForm.value;

    // llamada api
    this.auth.login({
      correo: email,
      password: password
    }).subscribe({
      next: (usuario) => {
        
        localStorage.setItem('sesion', JSON.stringify({
          logueado: true,
          usuario: usuario.nombre + ' ' + usuario.apellido,
          correo: usuario.correo,
          rol: usuario.rol
        }));

        this.loading = false;

        // Redirección
        window.location.href = '/lista-resultado';
      },
      error: (err) => {
        console.error('Error login:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
}
