import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { GeneralService } from '../../../core/gerneral.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es' }
  ]
})
export class DashboardComponent implements OnInit {
  public user: any;
  public student: any;
  attendanceTypes = ['late', 'absent', 'license'];
  attendanceSummary: { [key: string]: number } = {};
  behaviorSummary: Record<string, number> = {}; 
  behaviorTypes: string[] = ['1', '2', '3'];

  // 🔹 control modal
  showAlertModal = false;
  private closeCount = 0;

  constructor(
    private homeService: HomeService,
    private generalService: GeneralService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.user = this.generalService.getUser();
    const userData: any = await this.homeService.getUser(this.user.id);
    const date: any = await this.homeService.getStudents(userData.data[0].student[0].id);
    this.student = date.data[0];

    this.countAttendanceByType();

    // evaluar alertas de este mes
     this.checkShowAlertModal();
  }

  countAttendanceByType() {
    this.attendanceSummary = {
      present: 0,
      late: 0,
      absent: 0,
      license: 0
    };

    for (const att of this.student.attendances) {
      const status = att.status || 'unknown';
      if (this.attendanceSummary.hasOwnProperty(status)) {
        this.attendanceSummary[status]++;
      }
    }

    for (const behavior of this.student.behaviors) {
      const type = behavior.type;
      if (!this.behaviorSummary[type]) {
        this.behaviorSummary[type] = 0;
      }
      this.behaviorSummary[type]++;
    }
  }

  mapAttendanceStatus(status: string): string {
    switch (status) {
      case 'present': return 'Presente';
      case 'late': return 'Atraso';
      case 'absent': return 'Falta';
      case 'license': return 'Licencia';
      default: return '-';
    }
  }

  getBehaviorTypeLabel(type: string): string {
    switch (type) {
      case '1': return 'Incidente Grave';
      case '2': return 'Aviso';
      case '3': return 'Reconocimiento';
      default: return 'Comportamiento';
    }
  }

  attendance() {
    this.router.navigate(['/home/attendance/', this.student.id]);
  }

  behavior() {
    this.router.navigate(['/home/behavior/', this.student.id]);
  }
   about() {
    this.router.navigate(['/home/about/']);
  }

   record() {
    this.router.navigate(['/home/record/', this.student.id]);
  }
  getGradeValue(value: number | null | undefined): string {
    return value != null ? value.toString() : '-';
  }

  getFilteredRecords(): any[] {
    if (!this.student) return [];

    const filteredAttendances = this.student.attendances
      .filter((att: any) => 
        (att.status === 'late' || att.status === 'absent') && 
        att.statusSee === 'active'
      )
      .map((att: any) => ({ ...att, tipo: 'attendance' }));

    const filteredBehaviors = this.student.behaviors
      .filter((beh: any) => beh.statusSee === 'active')
      .map((beh: any) => ({ ...beh, tipo: 'behavior' }));

    return [...filteredAttendances, ...filteredBehaviors];
  }

  // 🔹 lógica de alerta
  checkShowAlertModal() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let graves = 0;
  let avisos = 0;

  if (this.student?.behaviors) {
    this.student.behaviors.forEach((b: any) => {
      console.log(b);
      
      const behaviorDate = new Date(b.date);
      if (behaviorDate.getMonth() === currentMonth && behaviorDate.getFullYear() === currentYear) {
        if (b.type === '1' && b.statusSee =="active") graves++;
        if (b.type === '2' && b.statusSee =="active") avisos++;
      }
    });
  }

  
  if (graves >= 2 || avisos >= 3) {
    this.showAlertModal = true;
  } else {
    this.showAlertModal = false;
  }
}

  getCurrentMonthSummary() {
  const now = new Date();
  const currentMonth = now.getMonth();     // 0 = enero, 1 = febrero...
  const currentYear = now.getFullYear();

  const summary: any = { "1": 0, "2": 0 };

  if (this.student?.behaviors) {
    this.student.behaviors.forEach((b: any) => {
      const behaviorDate = new Date(b.date);
      if (behaviorDate.getMonth() === currentMonth && behaviorDate.getFullYear() === currentYear) {
        if (b.type && summary[b.type] !== undefined) {
          summary[b.type]++;
        }
      }
    });
  }

  return summary;
}

  closeAlertModal() {
    this.closeCount++;
    if (this.closeCount >= 2) {
      localStorage.setItem('alertModalClosed', 'true');
    }
    this.showAlertModal = false;
  }
}
