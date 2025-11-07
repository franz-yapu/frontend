import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin.service';
import { BreadCrumbComponent } from '../../../../project/components/bread-crumb/bread-crumb.component';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Behavior {
  id: string;
  studentId: string;
  date: string | Date;
  type: string;
  description: string;
  teacherId: string;
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
  behaviors?: Behavior[];
}

interface BehaviorDayGroup {
  date: Date;
  items: Behavior[];
}

interface BehaviorMonthGroup {
  month: Date;
  monthKey: string;
  days: BehaviorDayGroup[];
  items: Behavior[];
}

/* registerLocaleData(localeEs); */

@Component({
  selector: 'app-behavior-student',
  standalone: true,
  imports: [CommonModule, BreadCrumbComponent, DatePipe, FormsModule],
  templateUrl: './behavior-student.component.html',
  styleUrls: ['./behavior-student.component.scss'],
  providers: [DatePipe]
})
export class BehaviorStudentComponent implements OnInit {
  public breadcrumbItems: any[] = []; 
  public student: Student | null = null;
  public studentId: string = '';
  public behaviors: Behavior[] = [];
  public filteredBehaviors: Behavior[] = [];
  
  // Filtros de fecha
  public startDate: string = '';
  public endDate: string = '';
  
  // Grupos para mostrar
  public behaviorGroups: BehaviorMonthGroup[] = [];
  public filteredBehaviorGroups: BehaviorMonthGroup[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: AdminService,
  ) { }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id') || '';
    this.loadStudentData();
  }

  async loadStudentData(): Promise<void> {
    try {
      const res:any = await this.service.getBehaviors(this.studentId);
      this.student = res.data[0] || null;
      
      if (this.student?.behaviors) {
        this.behaviors = this.student.behaviors.map(b => ({
          ...b,
          date: new Date(b.date),
          createdAt: new Date(b.createdAt),
          updatedAt: new Date(b.updatedAt)
        }));
        
        this.filteredBehaviors = [...this.behaviors];
        this.updateBehaviorGroups();
      }

      this.setupBreadcrumbs();
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  }

  applyDateFilter(): void {
    if (!this.startDate && !this.endDate) {
      this.filteredBehaviors = [...this.behaviors];
    } else {
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;
      
      // Ajustar la fecha fin para incluir todo el día
      if (end) {
        end.setHours(23, 59, 59, 999);
      }

      this.filteredBehaviors = this.behaviors.filter(behavior => {
        const behaviorDate = new Date(behavior.date);
        
        if (start && end) {
          return behaviorDate >= start && behaviorDate <= end;
        } else if (start) {
          return behaviorDate >= start;
        } else if (end) {
          return behaviorDate <= end;
        }
        
        return true;
      });
    }
    
    this.updateBehaviorGroups();
  }

  clearDateFilter(): void {
    this.startDate = '';
    this.endDate = '';
    this.filteredBehaviors = [...this.behaviors];
    this.updateBehaviorGroups();
  }

  private updateBehaviorGroups(): void {
    this.filteredBehaviorGroups = this.groupBehaviorsByMonth(this.filteredBehaviors);
  }

  private groupBehaviorsByMonth(behaviors: Behavior[]): BehaviorMonthGroup[] {
    const monthGroupsMap = behaviors.reduce((acc: Record<string, BehaviorMonthGroup>, behavior) => {
      const date = new Date(behavior.date);
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
      acc[monthKey].items.push(behavior);
      return acc;
    }, {});

    // Para cada grupo de mes, agrupar por día
    Object.values(monthGroupsMap).forEach(monthGroup => {
      const dayGroupsMap = monthGroup.items.reduce((dayAcc: Record<string, BehaviorDayGroup>, behavior) => {
        const date = new Date(behavior.date);
        const dateStr = date.toISOString().split('T')[0];

        if (!dayAcc[dateStr]) {
          dayAcc[dateStr] = {
            date: date,
            items: []
          };
        }
        dayAcc[dateStr].items.push(behavior);
        return dayAcc;
      }, {});

      monthGroup.days = Object.values(dayGroupsMap)
        .map(dayGroup => ({
          ...dayGroup,
          items: dayGroup.items.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        }))
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    });

    return Object.values(monthGroupsMap)
      .sort((a, b) => b.month.getTime() - a.month.getTime());
  }

  private setupBreadcrumbs(): void {
    if (!this.student) return;
    
    this.breadcrumbItems = [
      
      { label: 'Estudiantes', icon: 'groups', routerLink: `/admin/behavior/${this.student.gradeId}` },
      { label: 'Historial', icon: 'history', routerLink: `/behaviors/${this.student.id}` }
    ];
  }

  getBehaviorTypeLabel(type: string): string {
    switch(type) {
      case '1': return 'Incidente Grave';
      case '2': return 'Aviso';
      case '3': return 'Reconocimiento';
      default: return 'Comportamiento';
    }
  }

  countBehaviorsByType(type: string): number {
    return this.filteredBehaviors.filter(b => b.type === type).length;
  }

  getBehaviorIcon(type: string): string {
    switch(type) {
      case '1': return 'warning';
      case '2': return 'info';
      case '3': return 'star';
      default: return 'help';
    }
  }

  getBehaviorColorClass(type: string): string {
    switch(type) {
      case '1': return 'bg-red-100 text-red-900';
      case '2': return 'bg-yellow-100 text-yellow-600';
      case '3': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}