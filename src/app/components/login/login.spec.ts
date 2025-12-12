import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../services/auth';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  const mockUsuario = {
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan@example.com',
    rol: 'USER'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        provideRouter(routes),
        AuthService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar loginForm en ngOnInit', () => {
    fixture.detectChanges();
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('debería tener controles email y password en el formulario', () => {
    fixture.detectChanges();
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');
    expect(emailControl).toBeTruthy();
    expect(passwordControl).toBeTruthy();
  });

  it('debería validar que email es obligatorio', () => {
    fixture.detectChanges();
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTrue();
  });

  it('debería validar el formato del email', () => {
    fixture.detectChanges();
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTrue();
  });

  it('debería aceptar un email válido', () => {
    fixture.detectChanges();
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('debería validar que la contraseña es obligatoria', () => {
    fixture.detectChanges();
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBeTrue();
  });

  it('debería inicializar la bandera de error en false', () => {
    expect(component.error).toBeFalse();
  });

  it('debería inicializar la bandera loading en false', () => {
    expect(component.loading).toBeFalse();
  });

  it('debería exponer get f() para controles del formulario', () => {
    fixture.detectChanges();
    const formControls = component.f;
    expect(formControls['email']).toBeDefined();
    expect(formControls['password']).toBeDefined();
  });

  it('debería marcar todos los campos como tocados al enviar formulario inválido', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('password')?.setValue('');
    
    component.login();
    
    expect(component.loginForm.get('email')?.touched).toBeTrue();
    expect(component.loginForm.get('password')?.touched).toBeTrue();
  });

  it('no debería enviar el formulario cuando sea inválido', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('password')?.setValue('');
    
    spyOn(authService, 'login');
    component.login();
    
    expect(component.loginForm.invalid).toBeTrue();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('el formulario debería ser inválido cuando falta el email', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('password')?.setValue('password123');
    
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('el formulario debería ser inválido cuando falta la contraseña', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('');
    
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('el formulario debería ser válido con todos los campos requeridos', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('password123');
    
    expect(component.loginForm.valid).toBeTrue();
  });

  it('debería llamar a authService.login al enviar formulario válido', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('password123');
    
    spyOn(authService, 'login').and.returnValue(of(mockUsuario));
    spyOn(router, 'navigate');
    
    component.login();
    
    expect(authService.login).toHaveBeenCalledWith({
      correo: 'test@example.com',
      password: 'password123'
    });
  });

  it('debería establecer loading en false tras login exitoso', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('password123');
    
    spyOn(authService, 'login').and.returnValue(of(mockUsuario));
    spyOn(router, 'navigate');
    
    component.login();
    
    expect(component.loading).toBeFalse();
  });

  it('debería guardar la sesión en localStorage tras login exitoso', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('password123');
    
    spyOn(authService, 'login').and.returnValue(of(mockUsuario));
    spyOn(localStorage, 'setItem');
    spyOn(router, 'navigate');
    
    component.login();
    
    expect(localStorage.setItem).toHaveBeenCalledWith('sesion', jasmine.any(String));
  });

  it('debería navegar a lista-resultado tras login exitoso', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('password123');
    
    spyOn(authService, 'login').and.returnValue(of(mockUsuario));
    spyOn(router, 'navigate');
    
    component.login();
    
    expect(router.navigate).toHaveBeenCalledWith(['/lista-resultado']);
  });

  it('debería establecer error en true cuando el login falla', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('wrongpassword');
    
    spyOn(authService, 'login').and.returnValue(throwError(() => new Error('Login failed')));
    
    component.login();
    
    expect(component.error).toBeTrue();
    expect(component.loading).toBeFalse();
  });

});
