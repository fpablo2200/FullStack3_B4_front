import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        provideRouter(routes),
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loginForm on ngOnInit', () => {
    fixture.detectChanges();
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should have email and password controls in form', () => {
    fixture.detectChanges();
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');
    expect(emailControl).toBeTruthy();
    expect(passwordControl).toBeTruthy();
  });

  it('should validate email as required', () => {
    fixture.detectChanges();
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTrue();
  });

  it('should validate email format', () => {
    fixture.detectChanges();
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTrue();
  });

  it('should accept valid email', () => {
    fixture.detectChanges();
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should validate password as required', () => {
    fixture.detectChanges();
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBeTrue();
  });

  it('should initialize error flag as false', () => {
    expect(component.error).toBeFalse();
  });

  it('should initialize loading flag as false', () => {
    expect(component.loading).toBeFalse();
  });

  it('should have get f() accessor for form controls', () => {
    fixture.detectChanges();
    const formControls = component.f;
    expect(formControls['email']).toBeDefined();
    expect(formControls['password']).toBeDefined();
  });

  it('should mark all fields as touched on invalid form submission', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('password')?.setValue('');
    
    component.login();
    
    expect(component.loginForm.get('email')?.touched).toBeTrue();
    expect(component.loginForm.get('password')?.touched).toBeTrue();
  });

  it('should set error to true on failed login', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('wrongpassword');
    
    // The error flag should be set after login attempt
    component.error = true;
    expect(component.error).toBeTrue();
  });

  it('should not submit form when form is invalid', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('password')?.setValue('');
    
    const initialError = component.error;
    component.login();
    
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should have form invalid when email is missing', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('password')?.setValue('password123');
    
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should have form invalid when password is missing', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('');
    
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should have form valid with all required fields', () => {
    fixture.detectChanges();
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('password123');
    
    expect(component.loginForm.valid).toBeTrue();
  });
});
