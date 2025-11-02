import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { BreadCrumbComponent } from '../../../project/components/bread-crumb/bread-crumb.component';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeService } from '../home.service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home-behavior',
  imports: [BreadCrumbComponent,CommonModule],
  templateUrl: './home-behavior.component.html',
  styleUrl: './home-behavior.component.scss',
  providers: [ DatePipe,
    { provide: LOCALE_ID, useValue: 'es' }]
})
export class HomeBehaviorComponent implements OnInit {
public breadcrumbItems = [
    { label: 'Inicio', icon: 'school', routerLink: '/home/dashboard' },
    { label: 'Comportamiento', icon: 'groups', routerLink: '/students' }
  ];
   student: any;
   stduentBehavior: any[] = [];
   groupedBehaviors: any[] = [];
    constructor( private homeService: HomeService,private activatedRoute: ActivatedRoute, private datePipe: DatePipe) { 
      
    }
    async ngOnInit(){
      this.student = this.activatedRoute.snapshot.paramMap.get('id')!;
      await this.getBehaviorData();
       await this.updateAllBehaviorsToInactive();
    }

   async  getBehaviorData() {
   const data: any = await this.homeService.getStudBehavior(this.student);
  this.student = data?.data?.[0] || {};
  this.student.behaviors = this.student.behaviors || [];
 
  this.groupBehaviorsByMonth();
   
   
    }

    getBehaviorTypeLabel(type: string): string {
  switch (type) {
    case '1': return 'Incidente grave';
    case '2': return 'Aviso';
    case '3': return 'Buen comportamiento';
    default: return 'Otro';
  }
}

toggleMonth(monthKey: string) {
  const group = this.groupedBehaviors.find(g => g.monthKey === monthKey);
  if (group) group.expanded = !group.expanded;
}

groupBehaviorsByMonth() {
  const groups: any = {};
  const currentMonthKey = this.datePipe.transform(new Date(), 'yyyy-MM')!;

  for (const behavior of this.student.behaviors || []) {
    const date = new Date(behavior.date);
    const key = this.datePipe.transform(date, 'yyyy-MM')!;
    const label = this.datePipe.transform(date, 'MMMM yyyy')!;
    
    if (!groups[key]) {
      groups[key] = {
        month: date,
        monthKey: key,
        behaviors: [],
        expanded: key === currentMonthKey  // ✅ Se expande si es el mes actual
      };
    }

    groups[key].behaviors.push(behavior);
  }

  this.groupedBehaviors = Object.values(groups).sort((a: any, b: any) =>
    new Date(b.month).getTime() - new Date(a.month).getTime()
  );
}

async updateAllBehaviorsToInactive() {
    if (!this.student?.behaviors?.length) return;

    try {
      // Versión simplificada sin firstValueFrom
      for (const behavior of this.student.behaviors) {
        if (behavior.statusSee === 'active') {
          await this.homeService.updateBehavior(behavior.id, { statusSee: 'desactive' });
        }
      }
    } catch (error) {
      console.error('Error en actualización:', error);
    }
  }




}
