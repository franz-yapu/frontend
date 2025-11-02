import { Component, OnInit } from '@angular/core';
import { BreadCrumbComponent } from '../../../../project/components/bread-crumb/bread-crumb.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../admin.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralService } from '../../../../core/gerneral.service';

@Component({
  selector: 'app-record',
  imports: [CommonModule, BreadCrumbComponent, ReactiveFormsModule],
  templateUrl: './record.component.html',
  styleUrl: './record.component.scss'
})
export class RecordComponent implements OnInit {
  public students: any[] = [];
  public couseId: any;
  public editForm: FormGroup;
  public editingStudent: any = null;
  
  public breadcrumbItems = [
    { label: 'Cursos', icon: 'school', routerLink: '/admin/record' },
    { label: 'Estudiantes', icon: 'groups', routerLink: '/admin/students' }
  ];
 user: any;
 viewBreadcrumb: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private service: AdminService,
    private fb: FormBuilder,
    private generalService: GeneralService
  ) {
    this.editForm = this.fb.group({
  grade1: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
  grade2: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
  grade3: [null, [Validators.required, Validators.min(0), Validators.max(100)]]
});
  }

  async ngOnInit(){

     this.user = this.generalService.getUser()
    if (this.user?.role?.name == "TEACHER") {
     const data:any = await this.service.getCourseTeacher(this.user.id)
     console.log(data);
     
     this.viewBreadcrumb= data.data.length > 0 ? false : true;
    }  
    this.couseId = this.route.snapshot.paramMap.get('id')!;
    this.loadStudents();
  }

 async loadStudents() {
  try {
    const res: any = await this.service.getrecords(this.couseId);
    this.students = res.data.map((student: any) => {
      // Inicializar academicRecord si no existe
      if (!student.record[0]) {
        student.record[0] = {
          grade1: null,
          grade2: null,
          grade3: null,
          finalGrade: null
        };
      }
      return student;
    });

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

  openEditModal(student: any) {
    this.editingStudent = student;
    this.editForm.patchValue({
      grade1: student.record[0]?.grade1 || null,
      grade2: student.record[0]?.grade2 || null,
      grade3: student.record[0]?.grade3 || null
    });
  }

  closeModal() {
    this.editingStudent = null;
  }

 calculateFinalGrade() {
  const { grade1, grade2, grade3 } = this.editForm.value;
 
    const final = Math.round((grade1 + grade2 + grade3) / 3);
    return final;
  
  return null;
}



  async saveGrades() {
      if (!this.editingStudent || this.editForm.invalid) {
    this.editForm.markAllAsTouched(); // Para mostrar errores si intenta guardar
    return;
  }
    if (!this.editingStudent) return;

    const finalGrade = this.calculateFinalGrade();
    const academicRecord = {
      ...this.editingStudent.record[0],
      ...this.editForm.value,
      finalGrade: finalGrade,
      studentId: this.editingStudent.id,
      gradeId: this.couseId,
      // Agregar otros campos necesarios según tu modelo AcademicRecord
      semester: '1', // Ejemplo, ajustar según necesidad
      year: new Date().getFullYear(),
      teacherId:   this.generalService.getUser().id,
    };

    try {
      // Verificar si ya existe un registro académico
      if (this.editingStudent.record[0]?.id) {
        // Actualizar registro existente
        await this.service.editRecord(this.editingStudent.record[0].id, academicRecord);
      } else {
        // Crear nuevo registro
        await this.service.createRecords(academicRecord);
      }

      // Actualizar la vista
     const studentIndex = this.students.findIndex(
  s => s.id === this.editingStudent.id
);
if (studentIndex !== -1) {
  this.students[studentIndex].record[0] = academicRecord;
}
      this.loadStudents();
      this.closeModal();
    } catch (error) {
      console.error('Error saving grades:', error);
    }
  }

  getGradeColor(grade: any): any {
    if (grade === null) return '';
    return grade < 51 ? 'text-red-600 font-bold' : '';
  }
}