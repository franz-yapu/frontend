import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BreadCrumbComponent } from '../../../../project/components/bread-crumb/bread-crumb.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AdminService } from '../../admin.service';
import { FormsModule } from '@angular/forms';
import { GeneralService } from '../../../../core/gerneral.service';

@Component({
  selector: 'app-list-students-behavior',
  imports: [CommonModule, FormsModule, BreadCrumbComponent],
  templateUrl: './list-students-behavior.component.html',
  styleUrl: './list-students-behavior.component.scss',
  providers: [DialogService],
})
export class ListStudentsBehaviorComponent implements OnInit {
  public students: any[] = [];
  public filteredStudents: any[] = [];
  public couseId: any;
  ref!: DynamicDialogRef;
  public breadcrumbItems = [
    { label: 'Cursos', icon: 'school', routerLink: '/admin/behavior' },
    { label: 'Estudiantes', icon: 'groups', routerLink: '/students' }
  ];
  public newBehaviorType: {[key: string]: string} = {};
  public newBehaviorDesc: {[key: string]: string} = {};
  public expandedStudents: {[key: string]: boolean} = {};
  public user: any;
  public dataCourse: any;
  public viewBreadcrumb: boolean = false;
  
  // Búsqueda
  public searchTerm: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: AdminService,
    private dialogService: DialogService,
    private generalService: GeneralService,
  ) { }

  async ngOnInit() {
    this.user = this.generalService.getUser();
    if (this.user?.role?.name == "TEACHER") {
      const data: any = await this.service.getCourseTeacher(this.user.id);
      this.dataCourse = data.data[0];
      this.viewBreadcrumb = data.data.length > 0 ? false : true;
    } 
    
    this.user = this.generalService.getUser();
    this.couseId = this.activatedRoute.snapshot.paramMap.get('id')!;
    
    await this.loadStudents();
  }

  async loadStudents() {
    try {
      const res: any = await this.service.getStudentsBehavior(this.couseId);
      this.students = res.data || [];
      
      // Ordenar por apellido paterno y luego materno
      this.students.sort((a: any, b: any) => {
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

      // Ordenar incidencias de cada alumno (última primero)
      this.students.forEach((s: any) => {
        if (s.behaviors?.length) {
          s.behaviors.sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        }
      });

       this.students.forEach((student: any) => {
      if (!this.newBehaviorType[student.id]) {
        this.newBehaviorType[student.id] = ''; // String vacío para que coincida con el option
      }
      if (!this.newBehaviorDesc[student.id]) {
        this.newBehaviorDesc[student.id] = '';
      }
    });


      // Inicializar lista filtrada
      this.filteredStudents = [...this.students];
      
    } catch (error) {
      console.error('Error loading students:', error);
    }
  }

  filterStudents(): void {
    if (!this.searchTerm.trim()) {
      this.filteredStudents = [...this.students];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredStudents = this.students.filter(student => 
      student.firstName?.toLowerCase().includes(term) ||
      student.lastName?.toLowerCase().includes(term) ||
      student.middleName?.toLowerCase().includes(term) ||
      `${student.firstName} ${student.lastName} ${student.middleName}`.toLowerCase().includes(term) ||
      `${student.lastName} ${student.middleName} ${student.firstName}`.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredStudents = [...this.students];
  }

  getBehaviorTypeLabel(type: string): string {
    switch(type) {
      case '1': return 'Incidente grave';
      case '2': return 'Aviso';
      case '3': return 'Buen comportamiento';
      default: return 'Otro';
    }
  }

 async addBehavior(studentId: string) {
  const now = new Date();
  const behavior = {
    studentId: studentId,
    date: now.toISOString(),
    type: this.newBehaviorType[studentId] || '1',
    description: this.newBehaviorDesc[studentId] || '',
    teacherId: this.user.id 
  };

  try {
    // 1. Crear el comportamiento
    await this.service.createBehavior(behavior);
    console.log('Comportamiento agregado:', behavior);

    // 2. Refrescar lista de estudiantes para obtener incidencias actualizadas
    await this.loadStudents();

    // 3. Buscar el estudiante recién actualizado
    const student = this.students.find((s: any) => s.id === studentId);

    if (student && student.behaviors?.length) {
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const tutorPhone = student.phoneTutor;
      const tutorName = `${student.firstNameTutor} ${student.lastNameTutor}`;
      const studentName = `${student.firstName} ${student.lastName}`;

      // 4. ENVÍO DE MENSAJES SEGÚN TIPO DE COMPORTAMIENTO

      // CASO 1: Si es INCIDENTE GRAVE (type = '1')
      if (behavior.type == '1') {
        const graveIncidents = student.behaviors.filter((b: any) => {
          const d = new Date(b.date);
          return (
            b.type =='1' &&
            d.getMonth() === currentMonth &&
            d.getFullYear() === currentYear
          );
        });

        // Si ya hay 2 incidentes graves -> enviar mensaje
        if (graveIncidents.length >= 2) {
          const message = `Estimado/a ${tutorName}, le informamos que su hijo/a ${studentName}
           ha acumulado ${graveIncidents.length} incidentes graves durante el presente mes. 

           Por este motivo, le solicitamos pasar por la unidad educativa esta semana para conversar 
           con el docente a cargo y coordinar las medidas correspondientes.`;

          try {
            await this.service.createMessage({
              message,
              phone: tutorPhone
            });
            console.log('Mensaje de incidentes graves enviado al tutor:', tutorPhone);
          } catch (err) {
            console.error('Error al enviar mensaje de WhatsApp para incidentes graves:', err);
          }
        }
      }

      // CASO 2: Si es AVISO (type = '2') - ENVIAR MENSAJE INMEDIATAMENTE
      else if (behavior.type === '2') {
        const message = `Estimado/a ${tutorName}, le informamos que su hijo/a ${studentName}
         ha recibido un aviso por: "${behavior.description}"

         Fecha: ${now.toLocaleDateString('es-ES')}
         
         Por favor, converse con su hijo/a sobre este comportamiento.`;

        try {
          await this.service.createMessage({
            message,
            phone: tutorPhone
          });
          console.log('Mensaje de aviso enviado al tutor:', tutorPhone);
        } catch (err) {
          console.error('Error al enviar mensaje de WhatsApp para aviso:', err);
        }
      }

      // CASO 3: Si es RECONOCIMIENTO POSITIVO (type = '3') - ENVIAR MENSAJE INMEDIATAMENTE
      else if (behavior.type === '3') {
        const message = `Estimado/a ${tutorName}, tenemos buenas noticias sobre ${studentName}!
         
         Ha recibido un reconocimiento positivo por: "${behavior.description}"
         
         Fecha: ${now.toLocaleDateString('es-ES')}
         
         ¡Felicite a su hijo/a por este logro!`;

        try {
          await this.service.createMessage({
            message,
            phone: tutorPhone
          });
          console.log('Mensaje de reconocimiento enviado al tutor:', tutorPhone);
        } catch (err) {
          console.error('Error al enviar mensaje de WhatsApp para reconocimiento:', err);
        }
      }
    }

    // 5. Limpiar campos del formulario
    this.newBehaviorType[studentId] = '';
    this.newBehaviorDesc[studentId] = '';

  } catch (error) {
    console.error('Error al agregar comportamiento:', error);
  }
}

  viewBehaviorHistory(student: any) {
    this.router.navigate(['/admin/behaviors/', student.id]);
  }

  toggleStudent(studentId: string) {
    this.expandedStudents[studentId] = !this.expandedStudents[studentId];
  }
}