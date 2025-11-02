import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BreadCrumbComponent } from '../../../../project/components/bread-crumb/bread-crumb.component';
import { AdminService } from '../../admin.service';
import { CommonModule } from '@angular/common';
import { GeneralService } from '../../../../core/gerneral.service';

@Component({
  selector: 'app-list-attendance',
  standalone: true,
  imports: [CommonModule, BreadCrumbComponent, FormsModule],
  templateUrl: './list-attendance.component.html',
  styleUrls: ['./list-attendance.component.scss']
})
export class ListAttendanceComponent implements OnInit {
  public students: any[] = [];
  public courseId: any;
  public startDate: string;
  public endDate: string;
  public dateRange: Date[] = [];
  public attendanceRecords: any = {};
  public dataReady: boolean = false;
  public autoInsertSuccess: boolean = false;
  public dataCourse:any
  public breadcrumbItems = [
    { label: 'Cursos', icon: 'school', routerLink: '/admin/attendance' },
    { label: 'Asistencia', icon: 'groups' }
  ];
  user: any;
  viewBreadcrumb: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private service: AdminService,
    private generalService: GeneralService,
  ) {
    const today = new Date();
    const initialStart = new Date(today);
    initialStart.setDate(today.getDate() - 3);
    this.startDate = this.formatDate(initialStart);

    const initialEnd = new Date(today);
    initialEnd.setDate(today.getDate() + 2);
    this.endDate = this.formatDate(initialEnd);
  }

  async ngOnInit() {
    this.user = this.generalService.getUser()
    if (this.user?.role?.name == "TEACHER") {
     const data:any = await this.service.getCourseTeacher(this.user.id)
     this.dataCourse=data.data[0];
     this.viewBreadcrumb= data.data.length > 0 ? false : true;
    }
    this.courseId = this.route.snapshot.paramMap.get('id')!;
    this.updateDateRange();
    await this.loadStudents();
    await this.checkAndInitializeDailyAttendance();
     this.initializeAttendanceRecords();
    this.dataReady = true;
  }

  async checkAndInitializeDailyAttendance(): Promise<void> {
    const today = new Date();
    const todayStr = this.formatDate(today);

    if (this.isWeekend(today)) return;

    console.log('Attempting initialization', today);

    const studentsNeedingAttendance = this.students.filter(student =>
      !this.attendanceRecords[student.id]?.[todayStr]?.status
    );

    if (studentsNeedingAttendance.length > 0) {
      console.log('Estudiantes sin asistencia hoy:', studentsNeedingAttendance.map(s => s.id));
      await this.initializeAttendanceForDate(today, studentsNeedingAttendance);
      this.autoInsertSuccess = true;
    } else {
      console.log('Todos los estudiantes ya tienen asistencia hoy.');
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  getDayName(date: Date): string {
    const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    return days[date.getDay()];
  }

  getAttendanceLabel(status: string): string {
    if (!status) return '-';
    switch (status) {
      case 'present': return 'Presente';
      case 'late': return 'Atraso';
      case 'absent': return 'Falta';
      case 'license': return 'Licencia';
      default: return '-';
    }
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  async loadStudents() {
  const res: any = await this.service.getStudentsCouses(this.courseId);
  this.students = (res.data[0]?.students || []).sort((a: any, b: any) => {
    const lastA = a.lastName?.toLowerCase() || '';
    const lastB = b.lastName?.toLowerCase() || '';
    if (lastA < lastB) return -1;
    if (lastA > lastB) return 1;

    const middleA = a.middleName?.toLowerCase() || '';
    const middleB = b.middleName?.toLowerCase() || '';
    return middleA.localeCompare(middleB);
  });

  const data: any = await this.service.getAttendance(this.courseId);
  this.processAttendanceData(data.data);
  this.initializeAttendanceRecords();
}


  processAttendanceData(apiData: any[]): void {
    apiData.forEach(record => {
      const dateStr = this.formatDate(new Date(record.date));

      if (!this.attendanceRecords[record.studentId]) {
        this.attendanceRecords[record.studentId] = {};
      }

      this.attendanceRecords[record.studentId][dateStr] = {
        status: record.status,
        id: record.id
      };
    });
  }

  initializeAttendanceRecords(): void {
    this.students.forEach(student => {
      if (!this.attendanceRecords[student.id]) {
        this.attendanceRecords[student.id] = {};
      }
      this.dateRange.forEach(date => {
        const dateStr = this.formatDate(date);
        if (!this.attendanceRecords[student.id][dateStr]) {
          this.attendanceRecords[student.id][dateStr] = {};
        }
      });
    });
  }

  updateDateRange(): void {
    this.dateRange = [];
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      this.dateRange.push(new Date(date));
    }
  }

  async initializeAttendanceForDate(date: Date, students: any[]): Promise<void> {
    const dateStr = this.formatDate(date);

    for (const student of students) {
      if (!this.attendanceRecords[student.id]) {
        this.attendanceRecords[student.id] = {};
      }

      this.attendanceRecords[student.id][dateStr] = { status: 'present' };

      try {
        const newRecord: any = await this.service.createAttendance({
          studentId: student.id,
          date: new Date(`${dateStr}T00:00:00.000Z`),
          notes: this.courseId,
          status: 'present'
        });

        this.attendanceRecords[student.id][dateStr].id = newRecord.id;
      } catch (error) {
        console.error(`Error al crear asistencia para ${student.id} en ${dateStr}:`, error);
        delete this.attendanceRecords[student.id][dateStr];
      }
    }
  }

  async saveAttendance(studentId: string, date: Date): Promise<void> {
    const dateStr = this.formatDate(date);
    const status = this.attendanceRecords[studentId][dateStr]?.status;

    try {
      if (this.attendanceRecords[studentId][dateStr]?.id) {
        await this.service.updateAttendance(
          this.attendanceRecords[studentId][dateStr].id,
          {
            status: status,
            notes: this.courseId
          }
        );
      } else {
        const newRecord: any = await this.service.createAttendance({
          studentId,
          date: new Date(`${dateStr}T00:00:00.000Z`),
          notes: this.courseId,
          status
        });

        this.attendanceRecords[studentId][dateStr].id = newRecord.id;
      }
    } catch (error) {
      console.error(`Error al guardar asistencia:`, error);
    }
  }


  getStatus(studentId: string, date: Date): string {
  const dateStr = this.formatDate(date);
  return this.attendanceRecords[studentId]?.[dateStr]?.status || '';
}

setStatus(studentId: string, date: Date, value: string): void {
  const dateStr = this.formatDate(date);
  if (!this.attendanceRecords[studentId]) {
    this.attendanceRecords[studentId] = {};
  }
  if (!this.attendanceRecords[studentId][dateStr]) {
    this.attendanceRecords[studentId][dateStr] = {};
  }
  this.attendanceRecords[studentId][dateStr].status = value;
  this.saveAttendance(studentId, date);
}
}