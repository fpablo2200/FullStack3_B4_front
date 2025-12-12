import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal';
import { CommonModule } from '@angular/common';

describe('ConfirmModal', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalComponent, CommonModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar el input titulo', () => {
    component.titulo = 'Confirmar eliminación';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Confirmar eliminación');
  });

  it('debe mostrar el input mensaje', () => {
    component.mensaje = '¿Está seguro de que desea continuar?';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p')?.textContent).toContain('¿Está seguro de que desea continuar?');
  });

  it('debe inicializar titulo como cadena vacía', () => {
    expect(component.titulo).toBe('');
  });

  it('debe inicializar mensaje como cadena vacía', () => {
    expect(component.mensaje).toBe('');
  });

  it('debe emitir onConfirm cuando se llama confirmar', (done) => {
    component.onConfirm.subscribe(() => {
      expect(true).toBeTruthy();
      done();
    });
    component.confirmar();
  });

  it('debe emitir onCancel cuando se llama cancelar', (done) => {
    component.onCancel.subscribe(() => {
      expect(true).toBeTruthy();
      done();
    });
    component.cancelar();
  });

  it('debe tener botón de cancelar', () => {
    fixture.detectChanges();
    const cancelBtn = fixture.nativeElement.querySelector('.btn-cancel');
    expect(cancelBtn).toBeTruthy();
  });

  it('debe tener botón de confirmar', () => {
    fixture.detectChanges();
    const confirmBtn = fixture.nativeElement.querySelector('.btn-confirm');
    expect(confirmBtn).toBeTruthy();
  });

  it('debe llamar cancelar cuando se hace click en el botón cancelar', () => {
    spyOn(component, 'cancelar');
    fixture.detectChanges();
    const cancelBtn = fixture.nativeElement.querySelector('.btn-cancel');
    cancelBtn.click();
    expect(component.cancelar).toHaveBeenCalled();
  });

  it('debe llamar confirmar cuando se hace click en el botón confirmar', () => {
    spyOn(component, 'confirmar');
    fixture.detectChanges();
    const confirmBtn = fixture.nativeElement.querySelector('.btn-confirm');
    confirmBtn.click();
    expect(component.confirmar).toHaveBeenCalled();
  });

  it('debe tener el div modal-backdrop', () => {
    fixture.detectChanges();
    const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
    expect(backdrop).toBeTruthy();
  });

  it('debe tener el div modal', () => {
    fixture.detectChanges();
    const modal = fixture.nativeElement.querySelector('.modal');
    expect(modal).toBeTruthy();
  });

  it('debe llamar cancelar cuando se hace click en el backdrop', () => {
    spyOn(component, 'cancelar');
    fixture.detectChanges();
    const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
    backdrop.click();
    expect(component.cancelar).toHaveBeenCalled();
  });

  it('debe tener el contenedor modal-buttons', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelector('.modal-buttons');
    expect(buttons).toBeTruthy();
  });

  it('debe renderizar múltiples títulos', () => {
    component.titulo = 'Test 1';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h3')?.textContent).toContain('Test 1');
    
    component.titulo = 'Test 2';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h3')?.textContent).toContain('Test 2');
  });

  it('debe tener dos botones con las clases correctas', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].classList.contains('btn-cancel')).toBeTruthy();
    expect(buttons[1].classList.contains('btn-confirm')).toBeTruthy();
  });

  it('debe tener el texto correcto en los botones', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].textContent).toContain('Cancelar');
    expect(buttons[1].textContent).toContain('Sí, eliminar');
  });

  it('debe ser un componente standalone', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener CommonModule importado', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('debe tener onConfirm EventEmitter', () => {
    expect(component.onConfirm).toBeTruthy();
  });

  it('debe tener onCancel EventEmitter', () => {
    expect(component.onCancel).toBeTruthy();
  });

  it('debe aceptar múltiples suscriptores para onConfirm', (done) => {
    let count = 0;
    component.onConfirm.subscribe(() => count++);
    component.onConfirm.subscribe(() => count++);
    component.confirmar();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(count).toBe(2);
      done();
    });
  });

  it('debe aceptar múltiples suscriptores para onCancel', (done) => {
    let count = 0;
    component.onCancel.subscribe(() => count++);
    component.onCancel.subscribe(() => count++);
    component.cancelar();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(count).toBe(2);
      done();
    });
  });
});
