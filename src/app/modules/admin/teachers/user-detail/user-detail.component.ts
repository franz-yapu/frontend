import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminService } from '../../admin.service';
import { ToasterService } from '../../../../project/services/toaster.service';
import { GeneralService } from '../../../../core/gerneral.service';
import { TeacherModalComponent } from '../teacher-modal/teacher-modal.component';
import { ConfirmationDialogComponent } from '../../../../project/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
  providers: [DialogService],
})
export class UserDetailComponent implements OnInit {
  ref!: DynamicDialogRef;
  user: any = null;
  userId: string = '';
  activeTab: string = 'info';
  
  // Logs de usuario (hardcodeados por ahora)
  userLogs: any[] = [
    {
      id: 1,
      type: 'login',
      action: 'Inicio de sesión exitoso',
      description: 'El usuario accedió al sistema desde una nueva ubicación',
      timestamp: new Date('2024-01-15T08:30:00'),
      ip: '192.168.1.100'
    },
    {
      id: 2,
      type: 'update',
      action: 'Perfil actualizado',
      description: 'Se modificó la información de contacto del usuario',
      timestamp: new Date('2024-01-14T15:20:00'),
      details: 'Cambio en número telefónico'
    },
    {
      id: 3,
      type: 'create',
      action: 'Nuevo registro creado',
      description: 'Usuario creó un nuevo estudiante en el sistema',
      timestamp: new Date('2024-01-14T10:15:00'),
      entity: 'Estudiante'
    },
    {
      id: 4,
      type: 'delete',
      action: 'Registro eliminado',
      description: 'Usuario eliminó un curso del sistema',
      timestamp: new Date('2024-01-13T16:45:00'),
      entity: 'Curso'
    },
    {
      id: 5,
      type: 'system',
      action: 'Configuración modificada',
      description: 'Se actualizaron los permisos del usuario',
      timestamp: new Date('2024-01-12T09:00:00'),
      changes: 'Permisos extendidos'
    },
    {
      id: 6,
      type: 'login',
      action: 'Intento de acceso fallido',
      description: 'Se detectó un intento de acceso con credenciales incorrectas',
      timestamp: new Date('2024-01-11T18:20:00'),
      ip: '192.168.1.150'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private adminService: AdminService,
    private dialogService: DialogService,
    private toaster: ToasterService,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.loadUserDetail();
  }

  async loadUserDetail() {
    this.generalService.show();
    try {
      const users: any = await this.adminService.getUser();
      this.user = users.data.find((u: any) => u.id === this.userId);
      console.log('Usuario cargado:', this.user);
      
      if (!this.user) {
        this.toaster.showToast({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario no encontrado',
        });
        this.goBack();
      }
    } catch (error) {
      this.toaster.showToast({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar el usuario',
      });
    } finally {
      this.generalService.hide();
    }
  }

  goBack() {
    this.location.back();
  }

  editUser() {
    this.ref = this.dialogService.open(TeacherModalComponent, {
      data: { data: this.user },
      header: 'Editar usuario',
      width: '800px',
      closable: false,
      closeOnEscape: true,
      dismissableMask: true,
    });
    this.ref.onClose.subscribe(() => this.loadUserDetail());
  }

  async toggleUserStatus() {
    const newStatus = this.user.status === 'active' ? 'desactive' : 'active';
    const actionText = newStatus === 'active' ? 'activar' : 'desactivar';
    
    this.ref = this.dialogService.open(ConfirmationDialogComponent, {
      data: {
        title: `${newStatus === 'active' ? 'Activar' : 'Desactivar'} Usuario`,
        description: `¿Estás seguro que deseas ${actionText} a ${this.user.firstName} ${this.user.lastName}?`
      },
      width: '400px',
      closable: false,
      closeOnEscape: true,
      dismissableMask: true,
    });

    this.ref.onClose.subscribe(async (result: boolean) => {
      if (result) {
        try {
          const data = {
            status: newStatus,
            id: this.user.id
          };
          
          console.log('Actualizando usuario:', data);
          await this.adminService.updateUser(this.user.id, data);
          
          // Actualizar el estado localmente
          this.user.status = newStatus;
          
          this.toaster.showToast({
            severity: 'success',
            summary: 'Éxito',
            detail: `Usuario ${actionText}do correctamente`,
          });
        } catch (error) {
          console.error('Error al actualizar usuario:', error);
          this.toaster.showToast({
            severity: 'error',
            summary: 'Error',
            detail: `No se pudo ${actionText} el usuario`,
          });
        }
      }
    });
  }

  deleteUser() {
    this.ref = this.dialogService.open(ConfirmationDialogComponent, {
      data: {
        title: 'Eliminar Usuario',
        description: `¿Estás seguro que deseas eliminar a ${this.user.firstName} ${this.user.lastName}? Esta acción no se puede deshacer.`
      },
      width: '400px',
      closable: false,
      closeOnEscape: true,
      dismissableMask: true,
    });

    this.ref.onClose.subscribe(async (result: boolean) => {
      if (result) {
        try {
          await this.adminService.userDelete(this.user.id);
          this.toaster.showToast({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario eliminado correctamente',
          });
          this.router.navigate(['/admin/users']);
        } catch (error) {
          this.toaster.showToast({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el usuario. El usuario ya tiene datos asignados.',
          });
        }
      }
    });
  }

  // Métodos para los logs
  getLogIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'login': 'login',
      'create': 'add_circle',
      'update': 'edit',
      'delete': 'delete',
      'system': 'settings'
    };
    return icons[type] || 'info';
  }

  getLogIconClass(type: string): string {
    const classes: { [key: string]: string } = {
      'login': 'bg-blue-500',
      'create': 'bg-green-500',
      'update': 'bg-yellow-500',
      'delete': 'bg-red-500',
      'system': 'bg-purple-500'
    };
    return classes[type] || 'bg-gray-500';
  }

  getLogTypeText(type: string): string {
    const texts: { [key: string]: string } = {
      'login': 'Acceso',
      'create': 'Creación',
      'update': 'Actualización',
      'delete': 'Eliminación',
      'system': 'Sistema'
    };
    return texts[type] || 'General';
  }

  // Métodos utilitarios
  getInitials(fullName: string): string {
    if (!fullName) return '';
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getRoleBadgeClass(roleName: string): string {
    const roleClasses: { [key: string]: string } = {
      'ADMIN': 'bg-purple-100 text-purple-800',
      'TEACHER': 'bg-blue-100 text-blue-800',
      'TUTOR': 'bg-green-100 text-green-800',
      'GUEST': 'bg-gray-100 text-gray-800'
    };
    return roleClasses[roleName] || 'bg-red-100 text-red-800';
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

  hasAdditionalInfo(): boolean {
    return false;
  }
}