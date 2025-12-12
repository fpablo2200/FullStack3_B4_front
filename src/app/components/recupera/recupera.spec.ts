import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Recupera } from './recupera';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('Recupera', () => {
  let component: Recupera;
  let fixture: ComponentFixture<Recupera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recupera, ReactiveFormsModule, CommonModule],
      providers: [
        provideRouter(routes),
        FormBuilder
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recupera);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar recoverForm con el control email', () => {
    expect(component.recoverForm).toBeTruthy();
    expect(component.recoverForm.get('email')).toBeTruthy();
  });

  it('debe tener email como campo requerido', () => {
    const emailControl = component.recoverForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTruthy();
  });

  it('debe validar el formato del email', () => {
    const emailControl = component.recoverForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
  });

  it('debe aceptar un email válido', () => {
    const emailControl = component.recoverForm.get('email');
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('debe inicializarse con mensajes vacíos', () => {
    expect(component.mensaje).toBe('');
    expect(component.error).toBe('');
  });

  it('debe mostrar error cuando el formulario es inválido', () => {
    component.recoverForm.get('email')?.setValue('');
    component.recuperar();
    expect(component.error).toBe('Por favor, ingresa un correo válido.');
  });

  it('debe mostrar error cuando el usuario no es encontrado', () => {
    localStorage.setItem('usuarios', JSON.stringify([]));
    component.recoverForm.get('email')?.setValue('notfound@example.com');
    component.recuperar();
    expect(component.error).toBe('Usuario no encontrado con ese correo.');
  });

  it('debe mostrar mensaje cuando el usuario es encontrado', () => {
    const mockUser = { nombre: 'John', email: 'john@example.com', password: 'pass123' };
    localStorage.setItem('usuarios', JSON.stringify([mockUser]));
    component.recoverForm.get('email')?.setValue('john@example.com');
    component.recuperar();
    expect(component.mensaje).toContain('John');
    expect(component.mensaje).toContain('pass123');
  });

  it('debe limpiar mensajes previos cuando se llama recuperar', () => {
    component.mensaje = 'Previous message';
    component.error = 'Previous error';
    component.recoverForm.get('email')?.setValue('');
    component.recuperar();
    expect(component.mensaje).toBe('');
  });

  it('debe proporcionar acceso a los controles del formulario vía get f()', () => {
    const controls = component.f;
    expect(controls['email']).toBeTruthy();
  });

  it('debe manejar múltiples usuarios en localStorage', () => {
    const users = [
      { nombre: 'User1', email: 'user1@example.com', password: 'pass1' },
      { nombre: 'User2', email: 'user2@example.com', password: 'pass2' }
    ];
    localStorage.setItem('usuarios', JSON.stringify(users));
    component.recoverForm.get('email')?.setValue('user2@example.com');
    component.recuperar();
    expect(component.mensaje).toContain('User2');
  });

  it('debe manejar un arreglo usuarios vacío', () => {
    localStorage.setItem('usuarios', JSON.stringify([]));
    component.recoverForm.get('email')?.setValue('any@example.com');
    component.recuperar();
    expect(component.error).toBe('Usuario no encontrado con ese correo.');
  });

  it('debe manejar la ausencia de usuarios en localStorage', () => {
    localStorage.removeItem('usuarios');
    component.recoverForm.get('email')?.setValue('test@example.com');
    component.recuperar();
    expect(component.error).toBe('Usuario no encontrado con ese correo.');
  });


});
