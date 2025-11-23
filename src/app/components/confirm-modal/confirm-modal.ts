import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="modal-backdrop" (click)="cancelar()"></div>

  <div class="modal">
    <h3>{{ titulo }}</h3>
    <p>{{ mensaje }}</p>

    <div class="modal-buttons">
      <button class="btn-cancel" (click)="cancelar()">Cancelar</button>
      <button class="btn-confirm" (click)="confirmar()">Sí, eliminar</button>
    </div>
  </div>
  `,
  styleUrls: ['./confirm-modal.scss']
})
export class ConfirmModalComponent {
  @Input() titulo: string = '';
  @Input() mensaje: string = '';
  @Output() onConfirm = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  confirmar() { this.onConfirm.emit(); }
  cancelar() { this.onCancel.emit(); }
}
