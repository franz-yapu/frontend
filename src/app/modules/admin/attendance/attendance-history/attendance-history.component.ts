import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';
import { BreadCrumbComponent } from '../../../../project/components/bread-crumb/bread-crumb.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Attendance {
  id: string;
  studentId: string;
  date: string | Date;
  status: string;
  notes?: string;
  statusSee: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  identityCard: string;
  gradeId: string;
  grade?: {
    id: string;
    name: string;
    level: string;
    section: string;
  };
}

interface AttendanceDayGroup {
  date: Date;
  items: Attendance[];
}

interface AttendanceMonthGroup {
  month: Date;
  monthKey: string;
  days: AttendanceDayGroup[];
  items: Attendance[];
}

@Component({
  selector: 'app-attendance-history',
  standalone: true,
  imports: [CommonModule, BreadCrumbComponent, DatePipe, FormsModule],
  templateUrl: './attendance-history.component.html',
  styleUrls: ['./attendance-history.component.scss'],
  providers: [DatePipe]
})
export class AttendanceHistoryComponent implements OnInit {
  public breadcrumbItems: any[] = []; 
  public student: Student | null = null;
  public studentId: string = '';
  public attendanceRecords: Attendance[] = [];
  public filteredAttendanceRecords: Attendance[] = [];
  
  // Filtros de fecha
  public startDate: string = '';
  public endDate: string = '';
  
  // Grupos para mostrar
  public attendanceGroups: AttendanceMonthGroup[] = [];
  public filteredAttendanceGroups: AttendanceMonthGroup[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AdminService,
  ) { }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id') || '';
    this.loadStudentData();
  }

  async loadStudentData(): Promise<void> {
    try {
      // Primero cargar información del estudiante (que incluye todo)
      const studentRes: any = await this.service.getStudentById(this.studentId);
      
      if (studentRes.data && studentRes.data.length > 0) {
        this.student = studentRes.data[0];
        
        // Ahora cargar las asistencias del estudiante
        const attendanceRes: any = await this.service.getStudentAttendances(this.studentId);
        this.attendanceRecords = attendanceRes.data.map((a: any) => ({
          ...a,
          date: new Date(a.date),
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt)
        }));
        
        this.filteredAttendanceRecords = [...this.attendanceRecords];
        this.updateAttendanceGroups();
        this.setupBreadcrumbs();
      } else {
        console.error('No se encontró información del estudiante');
      }

    } catch (error) {
      console.error('Error loading student data:', error);
    }
  }

  applyDateFilter(): void {
    if (!this.startDate && !this.endDate) {
      this.filteredAttendanceRecords = [...this.attendanceRecords];
    } else {
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;
      
      // Ajustar la fecha fin para incluir todo el día
      if (end) {
        end.setHours(23, 59, 59, 999);
      }

      this.filteredAttendanceRecords = this.attendanceRecords.filter(attendance => {
        const attendanceDate = new Date(attendance.date);
        
        if (start && end) {
          return attendanceDate >= start && attendanceDate <= end;
        } else if (start) {
          return attendanceDate >= start;
        } else if (end) {
          return attendanceDate <= end;
        }
        
        return true;
      });
    }
    
    this.updateAttendanceGroups();
  }

  clearDateFilter(): void {
    this.startDate = '';
    this.endDate = '';
    this.filteredAttendanceRecords = [...this.attendanceRecords];
    this.updateAttendanceGroups();
  }

  private updateAttendanceGroups(): void {
    this.filteredAttendanceGroups = this.groupAttendancesByMonth(this.filteredAttendanceRecords);
  }

  private groupAttendancesByMonth(attendances: Attendance[]): AttendanceMonthGroup[] {
    const monthGroupsMap = attendances.reduce((acc: Record<string, AttendanceMonthGroup>, attendance) => {
      const date = new Date(attendance.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthDate = new Date(date.getFullYear(), date.getMonth(), 1);

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthDate,
          monthKey: monthKey,
          days: [],
          items: []
        };
      }
      acc[monthKey].items.push(attendance);
      return acc;
    }, {});

    // Para cada grupo de mes, agrupar por día
    Object.values(monthGroupsMap).forEach(monthGroup => {
      const dayGroupsMap = monthGroup.items.reduce((dayAcc: Record<string, AttendanceDayGroup>, attendance) => {
        const date = new Date(attendance.date);
        const dateStr = date.toISOString().split('T')[0];

        if (!dayAcc[dateStr]) {
          dayAcc[dateStr] = {
            date: date,
            items: []
          };
        }
        dayAcc[dateStr].items.push(attendance);
        return dayAcc;
      }, {});

      monthGroup.days = Object.values(dayGroupsMap)
        .map(dayGroup => ({
          ...dayGroup,
          items: dayGroup.items.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        }))
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    });

    return Object.values(monthGroupsMap)
      .sort((a, b) => b.month.getTime() - a.month.getTime());
  }

  private setupBreadcrumbs(): void {
  console.log(this.student);
  
    
    if (!this.student) return;
    
    this.breadcrumbItems = [
     
      { 
        label: 'Asistencia', 
        icon: 'groups', 
        routerLink: `/admin/list-attendance/${this.student.gradeId}` 
      },
      { 
        label: 'Historial', 
        icon: 'history', 
        routerLink: `/admin/attendance-history/${this.student.id}` 
      }
    ];
  }

  getAttendanceTypeLabel(status: string): string {
    switch(status) {
      case 'present': return 'Presente';
      case 'late': return 'Atraso';
      case 'absent': return 'Falta';
      case 'license': return 'Licencia';
      default: return 'Asistencia';
    }
  }

  countAttendanceByType(status: string): number {
    return this.filteredAttendanceRecords.filter(a => a.status === status).length;
  }

  getAttendanceIcon(status: string): string {
    switch(status) {
      case 'present': return 'check_circle';
      case 'late': return 'schedule';
      case 'absent': return 'cancel';
      case 'license': return 'medical_services';
      default: return 'help';
    }
  }

  getAttendanceColorClass(status: string): string {
    switch(status) {
      case 'present': return 'bg-green-100 text-green-900';
      case 'late': return 'bg-yellow-100 text-yellow-600';
      case 'absent': return 'bg-red-100 text-red-600';
      case 'license': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}