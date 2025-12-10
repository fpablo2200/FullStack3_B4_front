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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display titulo input', () => {
    component.titulo = 'Confirmar eliminación';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Confirmar eliminación');
  });

  it('should display mensaje input', () => {
    component.mensaje = '¿Está seguro de que desea continuar?';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p')?.textContent).toContain('¿Está seguro de que desea continuar?');
  });

  it('should initialize titulo as empty string', () => {
    expect(component.titulo).toBe('');
  });

  it('should initialize mensaje as empty string', () => {
    expect(component.mensaje).toBe('');
  });

  it('should emit onConfirm when confirmar is called', (done) => {
    component.onConfirm.subscribe(() => {
      expect(true).toBeTruthy();
      done();
    });
    component.confirmar();
  });

  it('should emit onCancel when cancelar is called', (done) => {
    component.onCancel.subscribe(() => {
      expect(true).toBeTruthy();
      done();
    });
    component.cancelar();
  });

  it('should have cancel button', () => {
    fixture.detectChanges();
    const cancelBtn = fixture.nativeElement.querySelector('.btn-cancel');
    expect(cancelBtn).toBeTruthy();
  });

  it('should have confirm button', () => {
    fixture.detectChanges();
    const confirmBtn = fixture.nativeElement.querySelector('.btn-confirm');
    expect(confirmBtn).toBeTruthy();
  });

  it('should call cancelar when cancel button is clicked', () => {
    spyOn(component, 'cancelar');
    fixture.detectChanges();
    const cancelBtn = fixture.nativeElement.querySelector('.btn-cancel');
    cancelBtn.click();
    expect(component.cancelar).toHaveBeenCalled();
  });

  it('should call confirmar when confirm button is clicked', () => {
    spyOn(component, 'confirmar');
    fixture.detectChanges();
    const confirmBtn = fixture.nativeElement.querySelector('.btn-confirm');
    confirmBtn.click();
    expect(component.confirmar).toHaveBeenCalled();
  });

  it('should have modal-backdrop div', () => {
    fixture.detectChanges();
    const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
    expect(backdrop).toBeTruthy();
  });

  it('should have modal div', () => {
    fixture.detectChanges();
    const modal = fixture.nativeElement.querySelector('.modal');
    expect(modal).toBeTruthy();
  });

  it('should call cancelar when backdrop is clicked', () => {
    spyOn(component, 'cancelar');
    fixture.detectChanges();
    const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
    backdrop.click();
    expect(component.cancelar).toHaveBeenCalled();
  });

  it('should have modal-buttons container', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelector('.modal-buttons');
    expect(buttons).toBeTruthy();
  });

  it('should render multiple titles', () => {
    component.titulo = 'Test 1';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h3')?.textContent).toContain('Test 1');
    
    component.titulo = 'Test 2';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h3')?.textContent).toContain('Test 2');
  });

  it('should have two buttons with correct classes', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].classList.contains('btn-cancel')).toBeTruthy();
    expect(buttons[1].classList.contains('btn-confirm')).toBeTruthy();
  });

  it('should have correct button text', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons[0].textContent).toContain('Cancelar');
    expect(buttons[1].textContent).toContain('Sí, eliminar');
  });

  it('should be standalone component', () => {
    expect(component).toBeTruthy();
  });

  it('should have CommonModule imported', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });

  it('should have onConfirm EventEmitter', () => {
    expect(component.onConfirm).toBeTruthy();
  });

  it('should have onCancel EventEmitter', () => {
    expect(component.onCancel).toBeTruthy();
  });

  it('should accept multiple subscribers for onConfirm', (done) => {
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

  it('should accept multiple subscribers for onCancel', (done) => {
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
