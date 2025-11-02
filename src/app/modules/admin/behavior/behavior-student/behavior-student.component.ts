import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../admin.service';
import { BreadCrumbComponent } from '../../../../project/components/bread-crumb/bread-crumb.component';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
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

interface BehaviorGroup {
  date: Date;
  items: Behavior[];
}
registerLocaleData(localeEs);
@Component({
  selector: 'app-behavior-student',
  standalone: true,
  imports: [CommonModule, BreadCrumbComponent,DatePipe],
  templateUrl: './behavior-student.component.html',
  styleUrls: ['./behavior-student.component.scss'],
   providers: [DatePipe]
})
export class BehaviorStudentComponent implements OnInit {
  public breadcrumbItems: any[] = []; 
  public student: Student | null = null;
  public studentId: string = '';
  public behaviors: Behavior[] = [];
  public behaviorGroups: BehaviorGroup[] = [];

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
        
        this.behaviorGroups = this.groupBehaviorsByDate(this.behaviors);
      }

      this.setupBreadcrumbs();
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  }

  private groupBehaviorsByDate(behaviors: Behavior[]): BehaviorGroup[] {
  const groupsMap = behaviors.reduce((acc: Record<string, BehaviorGroup>, behavior) => {
    const date = new Date(behavior.date);
    const dateStr = date.toISOString().split('T')[0];

    if (!acc[dateStr]) {
      acc[dateStr] = {
        date: date,
        items: []
      };
    }
    acc[dateStr].items.push(behavior);
    return acc;
  }, {});

  return Object.values(groupsMap)
    .map(group => ({
      ...group,
      items: group.items.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

  private setupBreadcrumbs(): void {
    if (!this.student) return;
    
    this.breadcrumbItems = [
      { label: 'Cursos', icon: 'school', routerLink: '/admin/behavior' },
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
    return this.behaviors.filter(b => b.type === type).length;
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