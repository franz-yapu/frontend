import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../admin.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentModalComponent } from './student-modal/student-modal.component';
import { BreadCrumbComponent } from '../../../project/components/bread-crumb/bread-crumb.component';
import { ConfirmationDialogComponent } from '../../../project/components/confirmation-modal/confirmation-modal.component';
import { ToasterService } from '../../../project/services/toaster.service';

@Component({
  selector: 'app-students',
  imports: [CommonModule, FormsModule, BreadCrumbComponent],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss',
  providers: [DialogService],
})
export class StudentsComponent implements OnInit {
  public students: any[] = [];
  public filteredStudents: any[] = [];
  public couseId: any;
  public searchTerm: string = '';

  ref!: DynamicDialogRef;

  public breadcrumbItems = [
    { label: 'Cursos', icon: 'school', routerLink: '/admin/courses' },
    { label: 'Estudiantes', icon: 'groups', routerLink: '/students' },
  ];

  constructor(
    private route: ActivatedRoute,
    private service: AdminService,
    private dialogService: DialogService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.couseId = this.route.snapshot.paramMap.get('id')!;
    this.service.getStudentsCouses(this.couseId).then((res: any) => {
      this.students = this.sortStudents(res.data[0].students);
      this.filteredStudents = [...this.students];
    });
  }

  private sortStudents(students: any[]): any[] {
    return students.sort((a, b) => {
      const lastA = a.lastName?.toLowerCase() || '';
      const lastB = b.lastName?.toLowerCase() || '';
      if (lastA < lastB) return -1;
      if (lastA > lastB) return 1;

      const middleA = a.middleName?.toLowerCase() || '';
      const middleB = b.middleName?.toLowerCase() || '';
      if (middleA < middleB) return -1;
      if (middleA > middleB) return 1;

      return 0;
    });
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredStudents = this.students.filter((student: any) =>
      student.firstName?.toLowerCase().includes(term) ||
      student.lastName?.toLowerCase().includes(term) ||
      student.middleName?.toLowerCase().includes(term) ||
      student.identityCard?.toLowerCase().includes(term)
    );
  }

  openAddModal() {
    this.ref = this.dialogService.open(StudentModalComponent, {
      data: { couseId: this.couseId },
      header: 'Nuevo Estudiante',
      width: '800px',
      closable: true,
      closeOnEscape: true,
      dismissableMask: true,
    });
    this.ref.onClose.subscribe(() => this.ngOnInit());
  }

  openEditModal(student: any) {
    this.ref = this.dialogService.open(StudentModalComponent, {
      data: { data: student },
      header: 'Editar Estudiante',
      width: '800px',
      closable: true,
      closeOnEscape: true,
      dismissableMask: true,
    });
    this.ref.onClose.subscribe(() => this.ngOnInit());
  }

   async deleteStudent(student: any) {
    this.ref = this.dialogService.open(ConfirmationDialogComponent, {
      data: {
        title: 'Eliminar estudiante',
        description: `¿Estás seguro que deseas eliminar a ${student.firstName} ${student.lastName}?`
      },
      
      width: '400px',
      closable: false,
      closeOnEscape: true,
      dismissableMask: true,
    });

    this.ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.service.eliminarStudent(student.id).then(() => {
          this.ngOnInit();
        }).catch((error) => {
         this.toaster.showToast({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar al estudiante. El estudiante ya tiene datos asignados .',
          });
        });
      } else {
        console.log('Cancelado');
      }
    });
  }

  calculateAge(birthDate: string): number {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
  }
}
