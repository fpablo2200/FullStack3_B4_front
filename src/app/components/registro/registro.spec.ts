import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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

  const mockUser = {
    nombre: 'John',
    apellido: 'Doe',
    correo: 'john@test.com',
    rol: 'USER',
    estado: '1'
  };

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

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar registerForm con todos los controles', () => {
    expect(component.registerForm.get('nombre')).toBeTruthy();
    expect(component.registerForm.get('apellido')).toBeTruthy();
    expect(component.registerForm.get('correo')).toBeTruthy();
    expect(component.registerForm.get('password')).toBeTruthy();
    expect(component.registerForm.get('password2')).toBeTruthy();
    expect(component.registerForm.get('estado')).toBeTruthy();
    expect(component.registerForm.get('rol')).toBeTruthy();
  });

  it('debe tener validadores required en nombre', () => {
    const nombreControl = component.registerForm.get('nombre');
    nombreControl?.setValue('');
    expect(nombreControl?.hasError('required')).toBeTruthy();
  });

  it('debe tener validadores required en apellido', () => {
    const apellidoControl = component.registerForm.get('apellido');
    apellidoControl?.setValue('');
    expect(apellidoControl?.hasError('required')).toBeTruthy();
  });

  it('debe tener validador de email en correo', () => {
    const correoControl = component.registerForm.get('correo');
    correoControl?.setValue('invalid-email');
    expect(correoControl?.hasError('email')).toBeTruthy();
  });

  it('debe aceptar el formato de email válido', () => {
    const correoControl = component.registerForm.get('correo');
    correoControl?.setValue('test@example.com');
    expect(correoControl?.valid).toBeTruthy();
  });

  it('debe validar la longitud mínima de la contraseña', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
  });

  it('debe aceptar contraseñas de 6 o más caracteres', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('debe validar que las contraseñas coincidan', () => {
    component.registerForm.get('password')?.setValue('password123');
    component.registerForm.get('password2')?.setValue('password123');
    expect(component.registerForm.hasError('contrasenasNoCoinciden')).toBeFalsy();
  });

  it('debe mostrar error cuando las contraseñas no coinciden', () => {
    component.registerForm.get('password')?.setValue('password123');
    component.registerForm.get('password2')?.setValue('different');
    expect(component.registerForm.hasError('contrasenasNoCoinciden')).toBeTruthy();
  });

  it('debe inicializar con editMode en false', () => {
    expect(component.editMode).toBeFalsy();
  });

  it('debe inicializar con cargando en false cuando no hay id param', () => {
    expect(component.cargando).toBeFalsy();
  });

  it('debe establecer mensaje de error cuando el formulario es inválido al registrar', () => {
    component.registerForm.get('nombre')?.setValue('');
    component.registrar();
    expect(component.error).toContain('Revisa los campos');
  });

  it('debe limpiar mensajes de error y exito al iniciar registrar', () => {
    component.error = 'Previous error';
    component.exito = 'Previous success';
    component.registerForm.patchValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'test@test.com',
      password: '123456',
      password2: '123456'
    });

    spyOn(authService, 'verificarCorreo').and.returnValue(of({ existe: false }));
    spyOn(authService, 'registrarUsuario').and.returnValue(of({}));
    
    component.registrar();
    
    expect(component.error).toBe('');
    expect(component.exito).not.toBe('Previous success');
  });

  it('debe inicializar rol desde localStorage', () => {
    const mockSesion = { rol: 'admin' };
    localStorage.setItem('sesion', JSON.stringify(mockSesion));
    component.ngOnInit();
    expect(component.rol).toBe('admin');
  });

  it('debe manejar la ausencia de sesion en localStorage', () => {
    localStorage.removeItem('sesion');
    component.ngOnInit();
    expect(component.rol).toBeNull();
  });

  it('debe proporcionar acceso a controles mediante get f()', () => {
    const controls = component.f;
    expect(controls['nombre']).toBeTruthy();
  });

  it('debe inicializar con mensaje de error vacío', () => {
    expect(component.error).toBe('');
  });

  it('debe inicializar con mensaje de exito vacío', () => {
    expect(component.exito).toBe('');
  });

  it('debe marcar todos los campos como tocados cuando el formulario es inválido', () => {
    component.registerForm.get('nombre')?.setValue('');
    component.registrar();
    expect(component.registerForm.touched).toBeTruthy();
  });

  it('debe aceptar datos válidos del formulario', () => {
    component.registerForm.patchValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan@example.com',
      password: '123456',
      password2: '123456'
    });
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('debe cargar datos del usuario cuando se llama cargarDatosUsuario', () => {
    spyOn(authService, 'obtenerUsuario').and.returnValue(of(mockUser));
    component.cargarDatosUsuario(1);
    expect(component.registerForm.get('nombre')?.value).toBe('John');
    expect(component.registerForm.get('apellido')?.value).toBe('Doe');
  });

  it('debe manejar error al cargar datos del usuario', () => {
    spyOn(authService, 'obtenerUsuario').and.returnValue(throwError(() => new Error('Error')));
    component.cargarDatosUsuario(1);
    fixture.detectChanges();
    expect(component.error).toContain('Error');
  });

  it('debe validar que correo es requerido', () => {
    const correoControl = component.registerForm.get('correo');
    correoControl?.setValue('');
    expect(correoControl?.hasError('required')).toBeTruthy();
  });

  it('debe tener valor por defecto en estado', () => {
    const estadoControl = component.registerForm.get('estado');
    expect(estadoControl?.value).toBe('1');
  });

  it('debe cargar datos en modo edición', () => {
    const mockActivatedRoute = TestBed.inject(ActivatedRoute);
    spyOn(mockActivatedRoute.snapshot.paramMap, 'get').and.returnValue('1');
    spyOn(authService, 'obtenerUsuario').and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(component.editMode).toBeTrue();
    expect(component.editingId).toBe(1);
  });

  it('debe establecer error cuando falla la carga en modo edición', () => {
    const mockActivatedRoute = TestBed.inject(ActivatedRoute);
    spyOn(mockActivatedRoute.snapshot.paramMap, 'get').and.returnValue('1');
    spyOn(authService, 'obtenerUsuario').and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(component.error).toBe('No se pudo cargar el resultado.');
    expect(component.cargando).toBeFalse();
  });

  it('debe llamar verificarCorreo al enviar formulario válido', () => {
    component.registerForm.patchValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan@example.com',
      password: '123456',
      password2: '123456'
    });

    spyOn(authService, 'verificarCorreo').and.returnValue(of({ existe: false }));
    spyOn(authService, 'registrarUsuario').and.returnValue(of({}));

    component.registrar();

    expect(authService.verificarCorreo).toHaveBeenCalledWith('juan@example.com');
  });

  it('debe mostrar error cuando el correo ya existe', () => {
    component.registerForm.patchValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'existing@example.com',
      password: '123456',
      password2: '123456'
    });

    spyOn(authService, 'verificarCorreo').and.returnValue(of({ existe: true }));

    component.registrar();

    expect(component.error).toBe('El correo ya está registrado.');
  });

  it('debe llamar registrarUsuario cuando el correo no existe', () => {
    component.registerForm.patchValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'new@example.com',
      password: '123456',
      password2: '123456'
    });

    spyOn(authService, 'verificarCorreo').and.returnValue(of({ existe: false }));
    spyOn(authService, 'registrarUsuario').and.returnValue(of({}));

    component.registrar();

    expect(authService.registrarUsuario).toHaveBeenCalledWith(jasmine.objectContaining({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'new@example.com',
      rol: 'USER'
    }));
  });

  it('debe mostrar mensaje de éxito al registrarse correctamente', () => {
    component.registerForm.patchValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'new@example.com',
      password: '123456',
      password2: '123456'
    });

    spyOn(authService, 'verificarCorreo').and.returnValue(of({ existe: false }));
    spyOn(authService, 'registrarUsuario').and.returnValue(of({}));

    component.registrar();

    expect(component.exito).toContain('registrado con éxito');
  });

  it('debe manejar error en caso de fallo al registrar', () => {
    component.registerForm.patchValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'new@example.com',
      password: '123456',
      password2: '123456'
    });

    spyOn(authService, 'verificarCorreo').and.returnValue(of({ existe: false }));
    spyOn(authService, 'registrarUsuario').and.returnValue(throwError(() => new Error('Error')));

    component.registrar();

    expect(component.error).toContain('error al registrar');
  });

  it('debe manejar error de verificarCorreo', () => {
    component.registerForm.patchValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'new@example.com',
      password: '123456',
      password2: '123456'
    });

    spyOn(authService, 'verificarCorreo').and.returnValue(throwError(() => new Error('Error')));

    component.registrar();

    expect(component.error).toBe('Error al verificar el correo.');
  });

  it('debe llamar actualizarUsuario en modo edición', () => {
    component.editMode = true;
    component.editingId = 1;
    component.registerForm.patchValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan@example.com',
      password: '123456',
      password2: '123456'
    });

    spyOn(authService, 'actualizarUsuario').and.returnValue(of({}));
    spyOn(router, 'navigate');

    component.registrar();

    expect(authService.actualizarUsuario).toHaveBeenCalledWith(1, jasmine.any(Object));
  });

  it('debe mostrar mensaje de éxito al actualizar correctamente', () => {
    component.editMode = true;
    component.editingId = 1;
    component.registerForm.patchValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan@example.com',
      password: '123456',
      password2: '123456'
    });

    spyOn(authService, 'actualizarUsuario').and.returnValue(of({}));
    spyOn(router, 'navigate');

    component.registrar();

    expect(component.exito).toContain('actualizado con éxito');
  });

  it('debe manejar error en caso de fallo al actualizar', () => {
    component.editMode = true;
    component.editingId = 1;
    component.registerForm.patchValue({
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan@example.com',
      password: '123456',
      password2: '123456'
    });

    spyOn(authService, 'actualizarUsuario').and.returnValue(throwError(() => new Error('Error')));

    component.registrar();

    expect(component.error).toBe('Error al actualizar usuario.');
  });

  it('debe limpiar validadores de contraseña al cargar datos del usuario', () => {
    spyOn(authService, 'obtenerUsuario').and.returnValue(of(mockUser));
    
    component.cargarDatosUsuario(1);

    const passwordControl = component.registerForm.get('password');
    const password2Control = component.registerForm.get('password2');

    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('debe usar el validador personalizado passwordsIgualesValidator', () => {
    const validator = component.passwordsIgualesValidator(component.registerForm);
    component.registerForm.get('password')?.setValue('pass1');
    component.registerForm.get('password2')?.setValue('pass2');
    
    const result = component.passwordsIgualesValidator(component.registerForm);
    expect(result).toEqual({ contrasenasNoCoinciden: true });
  });
});
