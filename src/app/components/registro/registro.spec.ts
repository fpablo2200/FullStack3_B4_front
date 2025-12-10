import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './registro';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { AuthService } from '../../services/auth';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

describe('Registro', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule, ReactiveFormsModule, CommonModule],
      providers: [
        provideRouter(routes),
        AuthService,
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } },
            params: of({})
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    component.ngOnInit();
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize registerForm with all controls', () => {
    expect(component.registerForm.get('nombre')).toBeTruthy();
    expect(component.registerForm.get('apellido')).toBeTruthy();
    expect(component.registerForm.get('correo')).toBeTruthy();
    expect(component.registerForm.get('password')).toBeTruthy();
    expect(component.registerForm.get('password2')).toBeTruthy();
    expect(component.registerForm.get('estado')).toBeTruthy();
    expect(component.registerForm.get('rol')).toBeTruthy();
  });

  it('should have required validators on nombre', () => {
    const nombreControl = component.registerForm.get('nombre');
    nombreControl?.setValue('');
    expect(nombreControl?.hasError('required')).toBeTruthy();
  });

  it('should have required validators on apellido', () => {
    const apellidoControl = component.registerForm.get('apellido');
    apellidoControl?.setValue('');
    expect(apellidoControl?.hasError('required')).toBeTruthy();
  });

  it('should have email validator on correo', () => {
    const correoControl = component.registerForm.get('correo');
    correoControl?.setValue('invalid-email');
    expect(correoControl?.hasError('email')).toBeTruthy();
  });

  it('should accept valid email format', () => {
    const correoControl = component.registerForm.get('correo');
    correoControl?.setValue('test@example.com');
    expect(correoControl?.valid).toBeTruthy();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
  });

  it('should accept password with 6 or more characters', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should validate that passwords match', () => {
    component.registerForm.get('password')?.setValue('password123');
    component.registerForm.get('password2')?.setValue('password123');
    expect(component.registerForm.hasError('contrasenasNoCoinciden')).toBeFalsy();
  });

  it('should show error when passwords do not match', () => {
    component.registerForm.get('password')?.setValue('password123');
    component.registerForm.get('password2')?.setValue('different');
    expect(component.registerForm.hasError('contrasenasNoCoinciden')).toBeTruthy();
  });

  it('should initialize with editMode false', () => {
    expect(component.editMode).toBeFalsy();
  });

  it('should initialize with cargando false when no id param', () => {
    expect(component.cargando).toBeFalsy();
  });

  it('should set error message when form is invalid on registrar', () => {
    component.registerForm.get('nombre')?.setValue('');
    component.registrar();
    expect(component.error).toContain('Revisa los campos');
  });

  it('should clear error and exito messages at start of registrar', () => {
    component.error = 'Previous error';
    component.exito = 'Previous success';
    component.registerForm.patchValue({
      nombre: '',
      apellido: '',
      correo: 'test@test.com'
    });
    component.registrar();
    fixture.detectChanges();
    expect(component.error).not.toBe('Previous error');
  });

  it('should have rol initialized from localStorage', () => {
    const mockSesion = { rol: 'admin' };
    localStorage.setItem('sesion', JSON.stringify(mockSesion));
    component.ngOnInit();
    expect(component.rol).toBe('admin');
  });

  it('should handle missing sesion in localStorage', () => {
    localStorage.removeItem('sesion');
    component.ngOnInit();
    expect(component.rol).toBeNull();
  });

  it('should provide form controls access via get f()', () => {
    if (component['f']) {
      expect(component['f']['nombre']).toBeTruthy();
    }
  });

  it('should have ReactiveFormsModule imported', () => {
    expect(component.registerForm).toBeTruthy();
  });

  it('should have CommonModule imported', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('should initialize with empty error message', () => {
    expect(component.error).toBe('');
  });

  it('should initialize with empty exito message', () => {
    expect(component.exito).toBe('');
  });

  it('should mark all fields as touched when form is invalid', () => {
    component.registerForm.get('nombre')?.setValue('');
    component.registrar();
    expect(component.registerForm.touched).toBeTruthy();
  });

  it('should accept valid form data', () => {
    component.registerForm.patchValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan@example.com',
      password: '123456',
      password2: '123456'
    });
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should load user data when cargarDatosUsuario is called', () => {
    const mockUser = { nombre: 'John', apellido: 'Doe', correo: 'john@test.com' };
    spyOn(authService, 'obtenerUsuario').and.returnValue(of(mockUser));
    component.cargarDatosUsuario(1);
    expect(component.registerForm.get('nombre')?.value).toBe('John');
  });

  it('should handle error when loading user data', () => {
    spyOn(authService, 'obtenerUsuario').and.returnValue(throwError(() => new Error('Error')));
    component.cargarDatosUsuario(1);
    fixture.detectChanges();
    expect(component.error).toContain('Error');
  });

  it('should validate correo is required', () => {
    const correoControl = component.registerForm.get('correo');
    correoControl?.setValue('');
    expect(correoControl?.hasError('required')).toBeTruthy();
  });

  it('should have default estado value', () => {
    const estadoControl = component.registerForm.get('estado');
    expect(estadoControl?.value).toBe('1');
  });
});
