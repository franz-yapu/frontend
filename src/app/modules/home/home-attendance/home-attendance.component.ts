import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { BreadCrumbComponent } from '../../../project/components/bread-crumb/bread-crumb.component';
import { HomeService } from '../home.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-attendance',
  imports: [BreadCrumbComponent, CommonModule],
  templateUrl: './home-attendance.component.html',
  styleUrl: './home-attendance.component.scss',
  providers: [ DatePipe,
    { provide: LOCALE_ID, useValue: 'es' }]
})
export class HomeAttendanceComponent implements OnInit {
  public breadcrumbItems = [
    { label: 'Inicio', icon: 'school', routerLink: '/home/dashboard' },
    { label: 'Asistencia', icon: 'groups', routerLink: '/students' }
  ];
  student: any;
  public monthGroups: any[] = [];
  currentMonth: string;
  constructor( private homeService: HomeService, private activatedRoute: ActivatedRoute,private datePipe: DatePipe) { 
 const currentDate = new Date();
    this.currentMonth = this.datePipe.transform(currentDate, 'yyyy-MM')!;
  }

  async ngOnInit() {
     this.student = this.activatedRoute.snapshot.paramMap.get('id')!;
    await this.getAttendanceData();
    await this.updateAllToInactive()
  }

async getAttendanceData() {
  try {
    const res: any = await this.homeService.getStudAttendance(this.student);
    this.student = res?.data?.[0] || {};
    this.student.attendances = this.student.attendances || []; // Asegurar que attendances sea un array
    this.monthGroups = this.getAttendanceByMonth();
  } catch (error) {
    console.error('Error loading attendance data:', error);
    this.student = {};
    this.monthGroups = [];
  }
}

  mapAttendanceStatus(status: string): string {
  switch (status) {
    case 'present': return 'Presente';
    case 'late': return 'Atraso';
    case 'absent': return 'Falta';
    case 'license': return 'Licencia';
    default: return status; // Mostrar el valor original si no coincide
  }
}

getAttendanceByMonth() {
  const groups: any = {};

  this.student.attendances.forEach((attendance: any) => {
    const date = new Date(attendance.date);
    const monthKey = this.datePipe.transform(date, 'yyyy-MM')!;
    
    if (!groups[monthKey]) {
      groups[monthKey] = {
        month: date,
        monthKey: monthKey,
        attendances: [],
        expanded: monthKey === this.currentMonth,
        summary: { present: 0, late: 0, absent: 0, license: 0 }
      };
    }

    groups[monthKey].attendances.push(attendance);

    // Resumen
    switch(attendance.status) {
      case 'present': groups[monthKey].summary.present++; break;
      case 'late': groups[monthKey].summary.late++; break;
      case 'absent': groups[monthKey].summary.absent++; break;
      case 'license': groups[monthKey].summary.license++; break;
    }
  });

  // Ordenar los meses y dentro de cada mes por fecha descendente
  const result = Object.values(groups).sort((a: any, b: any) => 
    new Date(b.month).getTime() - new Date(a.month).getTime()
  );

  result.forEach((g: any) => {
    g.attendances.sort((a: any, b: any) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  return result;
}

  toggleMonth(monthDate: Date) {
    const monthKey = this.datePipe.transform(monthDate, 'yyyy-MM')!;
    const group = this.monthGroups.find(g => g.monthKey === monthKey);
    if (group) {
      group.expanded = !group.expanded;
    }
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'mediumDate', '', 'es') || '';
  }

  async updateAllToInactive() {
    if (!this.student?.attendances?.length) return;

    try {
      // Versión simplificada sin firstValueFrom
      for (const attendance of this.student.attendances) {
        if (attendance.statusSee === 'active') {
          await this.homeService.updateAttendance(attendance.id, { statusSee: 'desactive' });
        }
      }
    } catch (error) {
      console.error('Error en actualización:', error);
    }
  }

}
