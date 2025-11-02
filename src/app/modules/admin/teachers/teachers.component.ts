import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GeneralService } from '../../../core/gerneral.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { TeacherModalComponent } from './teacher-modal/teacher-modal.component';
import { ConfirmationDialogComponent } from '../../../project/components/confirmation-modal/confirmation-modal.component';
import { ToasterService } from '../../../project/services/toaster.service';

@Component({
  selector: 'app-teachers',
  imports: [CommonModule, FormsModule],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.scss',
  providers: [DialogService],
})
export class TeachersComponent {
  ref!: DynamicDialogRef;
  users: any = [];
  filteredUsers: any = [];
  searchTerm: string = '';

  constructor(
    private adminService: AdminService,
    private dialogService: DialogService,
    private generalService: GeneralService,
     private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.generalService.show();
    this.loadUser();
  }

  async loadUser() {
    this.users = await this.adminService.getUser();
    this.filteredUsers = this.users?.data || [];
    this.generalService.hide();
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users?.data?.filter((user: any) =>
      (user.firstName + ' ' + user.lastName).toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term) ||
      user.address?.toLowerCase().includes(term) ||
      this.roleName(user.role.name).toLowerCase().includes(term)
    );
  }

  roleName(name: string) {
    const roleTranslations: { [key: string]: string } = {
      ADMIN: 'Administrativo',
      TEACHER: 'Profesor',
      TUTOR: 'Tutor',
      GUEST: 'Observador',
    };
    return roleTranslations[name] || name;
  }

  openAddModal() {
    this.ref = this.dialogService.open(TeacherModalComponent, {
      header: 'Nuevo usuario',
      width: '800px',
      closable: true,
      closeOnEscape: true,
      dismissableMask: true,
      styleClass: 'custom-dialog',
      contentStyle: { 'max-height': '90vh', overflow: 'auto' },
    });
    this.ref.onClose.subscribe(() => this.loadUser());
  }

  openEditModal(product: any) {
    this.ref = this.dialogService.open(TeacherModalComponent, {
      data: { data: product },
      header: 'Editar usuario',
      width: '800px',
      closable: false,
      closeOnEscape: true,
      dismissableMask: true,
    });
    this.ref.onClose.subscribe(() => this.loadUser());
  }

   async deleteUser(user: any) {
      this.ref = this.dialogService.open(ConfirmationDialogComponent, {
        data: {
          title: 'Eliminar Usuario',
          description: `¿Estás seguro que deseas eliminar a ${user.firstName} ${user.lastName}?`
        },
        
        width: '400px',
        closable: false,
        closeOnEscape: true,
        dismissableMask: true,
      });
  
      this.ref.onClose.subscribe((result: boolean) => {
        if (result) {
          this.adminService.userDelete(user.id).then(() => {
             this.toaster.showToast({
              severity: 'success',
              summary: 'Exito',
              detail: 'Se elimino al usuario correctamente.',
            });
            this.ngOnInit();
          }).catch((error) => {
           this.toaster.showToast({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar al usuario. El usuario ya tiene datos asignados .',
            });
          });
        } else {
          console.log('Cancelado');
        }
      });
    }
}
