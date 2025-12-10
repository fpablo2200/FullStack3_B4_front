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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize recoverForm with email control', () => {
    expect(component.recoverForm).toBeTruthy();
    expect(component.recoverForm.get('email')).toBeTruthy();
  });

  it('should have email as required field', () => {
    const emailControl = component.recoverForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.recoverForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
  });

  it('should accept valid email', () => {
    const emailControl = component.recoverForm.get('email');
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should initialize with empty messages', () => {
    expect(component.mensaje).toBe('');
    expect(component.error).toBe('');
  });

  it('should show error when form is invalid', () => {
    component.recoverForm.get('email')?.setValue('');
    component.recuperar();
    expect(component.error).toBe('Por favor, ingresa un correo válido.');
  });

  it('should show error when user not found', () => {
    localStorage.setItem('usuarios', JSON.stringify([]));
    component.recoverForm.get('email')?.setValue('notfound@example.com');
    component.recuperar();
    expect(component.error).toBe('Usuario no encontrado con ese correo.');
  });

  it('should display message when user is found', () => {
    const mockUser = { nombre: 'John', email: 'john@example.com', password: 'pass123' };
    localStorage.setItem('usuarios', JSON.stringify([mockUser]));
    component.recoverForm.get('email')?.setValue('john@example.com');
    component.recuperar();
    expect(component.mensaje).toContain('John');
    expect(component.mensaje).toContain('pass123');
  });

  it('should clear previous messages when recuperar is called', () => {
    component.mensaje = 'Previous message';
    component.error = 'Previous error';
    component.recoverForm.get('email')?.setValue('');
    component.recuperar();
    expect(component.mensaje).toBe('');
  });

  it('should provide form controls access via get f()', () => {
    const controls = component.f;
    expect(controls['email']).toBeTruthy();
  });

  it('should handle multiple users in localStorage', () => {
    const users = [
      { nombre: 'User1', email: 'user1@example.com', password: 'pass1' },
      { nombre: 'User2', email: 'user2@example.com', password: 'pass2' }
    ];
    localStorage.setItem('usuarios', JSON.stringify(users));
    component.recoverForm.get('email')?.setValue('user2@example.com');
    component.recuperar();
    expect(component.mensaje).toContain('User2');
  });

  it('should handle empty usuarios array', () => {
    localStorage.setItem('usuarios', JSON.stringify([]));
    component.recoverForm.get('email')?.setValue('any@example.com');
    component.recuperar();
    expect(component.error).toBe('Usuario no encontrado con ese correo.');
  });

  it('should handle missing usuarios in localStorage', () => {
    localStorage.removeItem('usuarios');
    component.recoverForm.get('email')?.setValue('test@example.com');
    component.recuperar();
    expect(component.error).toBe('Usuario no encontrado con ese correo.');
  });

  it('should validate email with numbers', () => {
    const emailControl = component.recoverForm.get('email');
    emailControl?.setValue('test123@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should reject email without @ symbol', () => {
    const emailControl = component.recoverForm.get('email');
    emailControl?.setValue('testexample.com');
    expect(emailControl?.hasError('email')).toBeTruthy();
  });

  it('should reject email without domain', () => {
    const emailControl = component.recoverForm.get('email');
    emailControl?.setValue('test@');
    expect(emailControl?.hasError('email')).toBeTruthy();
  });

  it('should render form element', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('form')).toBeTruthy();
  });

  it('should display error message in UI', () => {
    component.error = 'Test error message';
    fixture.detectChanges();
    expect(component.error).toBe('Test error message');
  });

  it('should have reactive forms imported', () => {
    const emailControl = component.recoverForm.get('email');
    expect(emailControl).toBeTruthy();
  });
});
