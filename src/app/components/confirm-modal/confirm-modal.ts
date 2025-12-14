import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="app-confirm-backdrop" (click)="cancelar($event)"></div>

  <div class="app-confirm-dialog">
    <h3>{{ titulo }}</h3>
    <p>{{ mensaje }}</p>

    <div class="app-confirm-buttons">
      <button class="app-btn-cancel" (click)="cancelar($event)">Cancelar</button>
      <button class="app-btn-confirm" (click)="confirmar($event)">Sí, eliminar</button>
    </div>
  </div>
  `,
  styleUrls: ['./confirm-modal.scss']
})
export class ConfirmModalComponent {
  @Input() titulo: string = '';
  @Input() mensaje: string = '';
  @Output() Confirm = new EventEmitter<void>();
  @Output() Cancel = new EventEmitter<void>();

  confirmar(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    console.log('[ConfirmModal] confirmar() called - emitting Confirm');
    this.Confirm.emit();
  }

  cancelar(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    console.log('[ConfirmModal] cancelar() called - emitting Cancel');
    this.Cancel.emit();
  }
}
