import { Component, OnInit } from '@angular/core';
import { BreadCrumbComponent } from '../../../../project/components/bread-crumb/bread-crumb.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../admin.service';
import { GeneralService } from '../../../../core/gerneral.service';

@Component({
  selector: 'app-record-list',
  imports: [CommonModule, BreadCrumbComponent],
  templateUrl: './record-list.component.html',
  styleUrl: './record-list.component.scss'
})
export class RecordListComponent implements OnInit {
  public students: any[] = [];
  public couseId: any;
  public dataCourse:any
  public breadcrumbItems = [
    { label: 'Cursos', icon: 'school', routerLink: '/admin/record' },
    { label: 'Registro Académico', icon: 'assignment', routerLink: '/admin/record' }
  ];
  
  user: any;
  viewBreadcrumb: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AdminService,
    private generalService: GeneralService
  ) {}

  async ngOnInit() {
    this.user = this.generalService.getUser();
    if (this.user?.role?.name == "TEACHER") {
      const data: any = await this.service.getCourseTeacher(this.user.id);
        this.dataCourse=data.data[0];
      this.viewBreadcrumb = data.data.length > 0 ? false : true;
    }  
    this.couseId = this.route.snapshot.paramMap.get('id')!;
    this.loadStudents();
  }

  async loadStudents() {
    try {
      const res: any = await this.service.getrecords(this.couseId);
      this.students = res.data;

      // Ordenar por apellido paterno y luego materno
      this.students.sort((a, b) => {
        if (a.lastName < b.lastName) return -1;
        if (a.lastName > b.lastName) return 1;
        if (a.middleName < b.middleName) return -1;
        if (a.middleName > b.middleName) return 1;
        return 0;
      });

    } catch (error) {
      console.error('Error loading students:', error);
    }
  }

  navigateToStudentRecord(student: any) {
    this.router.navigate(['/admin/record', this.couseId, 'student', student.id]);
  }

  getStudentInitials(student: any): string {
    return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`;
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