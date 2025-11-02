import { Component, OnInit } from '@angular/core';
import { BreadCrumbComponent } from '../../../../project/components/bread-crumb/bread-crumb.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralService } from '../../../../core/gerneral.service';

@Component({
  selector: 'app-student-record',
  imports: [CommonModule, BreadCrumbComponent, ReactiveFormsModule],
  templateUrl: './student-record.component.html',
  styleUrl: './student-record.component.scss'
})
export class StudentRecordComponent implements OnInit {
  public student: any = null;
  public subjects: any[] = [];
  public semesters = ['1', '2', '3'];
  public selectedSemester: string = '1';
  public couseId: any;
  public studentId: any;
  public editForm: FormGroup;
  public editingSubject: any = null;
  public currentAcademicRecord: any = null;
  public isLoading: boolean = true;
  
  public breadcrumbItems: any[] = [];
  
  user: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AdminService,
    private fb: FormBuilder,
    private generalService: GeneralService
  ) {
    // Campos no requeridos, validación solo si se ingresa valor
    this.editForm = this.fb.group({
      grade1: [null, [Validators.min(0), Validators.max(100)]],
      grade2: [null, [Validators.min(0), Validators.max(100)]],
      grade3: [null, [Validators.min(0), Validators.max(100)]]
    });
  }

  async ngOnInit() {
    this.user = this.generalService.getUser();
    this.couseId = this.route.snapshot.paramMap.get('courseId')!;
    this.studentId = this.route.snapshot.paramMap.get('studentId')!;
    console.log('sdf');
    
    await this.loadSubjects();
    await this.loadStudent();
    this.setupBreadcrumb();
    this.isLoading = false;
  }

  setupBreadcrumb() {
    if (this.student) {
      this.breadcrumbItems = [
        { label: 'Cursos', icon: 'school', routerLink: '/admin/courses' },
        { label: 'Registro Académico', icon: 'assignment', routerLink: `/admin/record/${this.couseId}` },
        { label: `${this.student.firstName} ${this.student.lastName}`, icon: 'person' }
      ];
    } else {
      this.breadcrumbItems = [
        { label: 'Cursos', icon: 'school', routerLink: '/admin/courses' },
        { label: 'Registro Académico', icon: 'assignment', routerLink: `/admin/record/${this.couseId}` },
        { label: 'Cargando...', icon: 'person' }
      ];
    }
  }

  async loadSubjects() {
    try {
      const res: any = await this.service.getSubjects();
      console.log(res);
      
      this.subjects = res.data;
      console.log(this.subjects);
      
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  }

  async loadStudent() {
    try {
      const res: any = await this.service.getStudentById(this.studentId);
      
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        this.student = res.data[0];
        this.organizeStudentRecords();
      } else {
        this.student = null;
      }
    } catch (error) {
      console.error('Error loading student:', error);
      this.student = null;
    }
  }

  organizeStudentRecords() {
    if (!this.student) {
      return;
    }

    if (!this.student.recordsBySubjectAndSemester) {
      this.student.recordsBySubjectAndSemester = {};
    }

    if (this.student.record && Array.isArray(this.student.record)) {
      this.student.record.forEach((record: any) => {
        const key = `${record.subjectId}_${record.semester}`;
        this.student.recordsBySubjectAndSemester[key] = record;
      });
    }
  }

  getStudentRecord(subjectId: string, semester: string): any {
    if (!this.student || !this.student.recordsBySubjectAndSemester) {
      return null;
    }
    const key = `${subjectId}_${semester}`;
    return this.student.recordsBySubjectAndSemester[key] || null;
  }

  getSemesterGrade(subjectId: string, semester: string): number | null {
    const record = this.getStudentRecord(subjectId, semester);
    return record?.finalGrade || null;
  }

  onSemesterChange(semester: string) {
    this.selectedSemester = semester;
  }

  openEditModal(subject: any) {
    if (!this.student) return;
    
    this.editingSubject = subject;
    const record = this.getStudentRecord(subject.id, this.selectedSemester);
    this.currentAcademicRecord = record;
    
    // Cargar las notas existentes o null si no existen
    this.editForm.patchValue({
      grade1: record?.grade1 || null,
      grade2: record?.grade2 || null,
      grade3: record?.grade3 || null
    });
  }

  closeModal() {
    this.editingSubject = null;
    this.currentAcademicRecord = null;
    this.editForm.reset();
  }

  calculateFinalGrade(): number | null {
    const { grade1, grade2, grade3 } = this.editForm.value;
    
    const grades = [grade1, grade2, grade3].filter(grade => 
      grade !== null && grade !== undefined && grade !== ''
    );
    
    if (grades.length === 0) {
      return null;
    }
    
    const sum = grades.reduce((total, grade) => total + Number(grade), 0);
    return Math.round(sum / grades.length);
  }

  async saveGrades() {
    if (!this.student || !this.editingSubject) {
      return;
    }

    // Marcar como touched para mostrar errores si los hay
    this.editForm.markAllAsTouched();

    // Verificar si hay errores de validación
    if (this.editForm.invalid) {
      return;
    }

    const finalGrade = this.calculateFinalGrade();
    
    const academicRecordData = {
      grade1: this.editForm.value.grade1 || null,
      grade2: this.editForm.value.grade2 || null,
      grade3: this.editForm.value.grade3 || null,
      finalGrade: finalGrade,
      studentId: this.student.id,
      gradeId: this.couseId,
      subjectId: this.editingSubject.id,
      semester: this.selectedSemester,
      year: new Date().getFullYear(),
      teacherId: this.user.id,
    };

    try {
      if (this.currentAcademicRecord?.id) {
        await this.service.editRecord(this.currentAcademicRecord.id, academicRecordData);
      } else {
        await this.service.createRecords(academicRecordData);
      }

      await this.loadStudent();
      this.closeModal();
    } catch (error) {
      console.error('Error saving grades:', error);
    }
  }

  getGradeColor(grade: any): string {
    if (grade === null || grade === undefined) return '';
    return grade < 51 ? 'text-red-600 font-bold' : 'text-green-600 font-bold';
  }

  navigateBack() {
    this.router.navigate(['/admin/record', this.couseId]);
  }
}