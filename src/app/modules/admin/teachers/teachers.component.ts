import { Component } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GeneralService } from '../../../core/gerneral.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin.service';
import { TeacherModalComponent } from './teacher-modal/teacher-modal.component';
import { ConfirmationDialogComponent } from '../../../project/components/confirmation-modal/confirmation-modal.component';
import { ToasterService } from '../../../project/services/toaster.service';
import { Router } from '@angular/router';

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
  paginatedUsers: any = [];
  
  // Filtros
  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';
  sortBy: string = 'name';
  
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  totalUsers: number = 0;
  
  // Ordenamiento
  sortField: string = 'name';
  sortDirection: string = 'asc';

  constructor(
    private adminService: AdminService,
    private dialogService: DialogService,
    private generalService: GeneralService,
    private toaster: ToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.generalService.show();
    this.loadUser();
  }

  async loadUser() {
    this.users = await this.adminService.getUser();
    this.applyFilter();
    this.generalService.hide();
  }

  applyFilter() {
    let filtered = this.users?.data || [];
    const term = this.searchTerm.toLowerCase();

    // Filtro por búsqueda general
    if (term) {
      filtered = filtered.filter((user: any) =>
        (user.firstName + ' ' + user.lastName).toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term) ||
        user.address?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        this.roleName(user.role.name).toLowerCase().includes(term)
      );
    }

    // Filtro por rol
    if (this.selectedRole) {
      filtered = filtered.filter((user: any) => 
        user.role.name === this.selectedRole
      );
    }

    // Filtro por estado (si existe el campo)
    if (this.selectedStatus) {
      filtered = filtered.filter((user: any) => {
        if (this.selectedStatus === 'active') {
          return user.isActive !== false; // Considera true o undefined como activo
        } else {
          return user.isActive === false;
        }
      });
    }

    // Aplicar ordenamiento
    filtered = this.sortUsers(filtered);

    this.filteredUsers = filtered;
    this.totalUsers = filtered.length;
    this.totalPages = Math.ceil(this.totalUsers / this.itemsPerPage);
    this.updatePaginatedUsers();
  }

  sortUsers(users: any[]): any[] {
    return users.sort((a, b) => {
      let valueA, valueB;

      switch (this.sortBy) {
        case 'name':
        case 'nameDesc':
          valueA = (a.firstName + ' ' + a.lastName).toLowerCase();
          valueB = (b.firstName + ' ' + b.lastName).toLowerCase();
          break;
        case 'role':
          valueA = this.roleName(a.role.name).toLowerCase();
          valueB = this.roleName(b.role.name).toLowerCase();
          break;
        case 'recent':
          // Asumiendo que tienes un campo createdAt o similar
          valueA = a.createdAt || a.id;
          valueB = b.createdAt || b.id;
          return this.sortBy === 'recent' ? 
            (valueB - valueA) : (valueA - valueB);
        default:
          valueA = a[this.sortBy];
          valueB = b[this.sortBy];
      }

      if (this.sortBy === 'nameDesc') {
        return valueB.localeCompare(valueA);
      }

      return valueA.localeCompare(valueB);
    });
  }

  sortByField(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilter();
  }

  // Métodos de paginación
  updatePaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalUsers);
    return `${start}-${end}`;
  }

  // Utilidades
  clearFilters() {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.sortBy = 'name';
    this.currentPage = 1;
    this.applyFilter();
  }

  hasActiveFilters(): boolean {
    return !!this.searchTerm || !!this.selectedRole || !!this.selectedStatus || this.sortBy !== 'name';
  }

  getInitials(fullName: string): string {
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

  openEditModal(user: any) {
    this.ref = this.dialogService.open(TeacherModalComponent, {
      data: { data: user },
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
            detail: 'Se eliminó al usuario correctamente.',
          });
          this.ngOnInit();
        }).catch((error) => {
          this.toaster.showToast({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar al usuario. El usuario ya tiene datos asignados.',
          });
        });
      }
    });
  }

  // Necesario para usar Math en el template
  get Math() {
    return Math;
  }
    viewUserDetail(user: any) {
    this.router.navigate(['/admin/teacher/users', user.id]);
  }
}