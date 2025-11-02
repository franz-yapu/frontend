import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule, ButtonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationDialogComponent {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  title: string = this.config.data?.title || 'Confirmar acción';
  description: string = this.config.data?.description || '¿Estás seguro de continuar?';

  confirm() {
    this.ref.close(true);
  }

  cancel() {
    this.ref.close(false);
  }
}