
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recupera',
  standalone: true,
  templateUrl: './recupera.html',
  styleUrl: './recupera.scss',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class Recupera implements OnInit {
  recoverForm!: FormGroup; // Formulario reactivo
  mensaje = '';
  error = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Inicialización del formulario con validación de email
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  recuperar() {
    this.mensaje = '';
    this.error = '';

    // Si el formulario no es válido, detener
    if (this.recoverForm.invalid) {
      this.error = 'Por favor, ingresa un correo válido.';
      return;
    }

    const emailIngresado = this.recoverForm.value.email;
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((u: any) => u.email === emailIngresado);

    if (!usuario) {
      this.error = 'Usuario no encontrado con ese correo.';
    } else {
      this.mensaje = `Hola ${usuario.nombre}, tu contraseña es: ${usuario.password}`;
    }
  }

  // Acceso directo desde HTML
  get f() {
    return this.recoverForm.controls;
  }
}

