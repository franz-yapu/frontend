import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import { AdminService } from '../admin.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { GeneralService } from '../../../core/gerneral.service';

@Component({
  selector: 'app-teacher-dashborad',
   imports: [CommonModule, NgxEchartsModule],
  templateUrl: './teacher-dashborad.component.html',
  styleUrl: './teacher-dashborad.component.scss',
 providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts: () => import('echarts') }
    }
  ]
})
export class TeacherDashboradComponent implements OnInit {
  isBrowser: boolean;
  chartOptions: EChartsOption[] = [];
  chartConfigs: any[] = [];
  public view =false
   user:any;
  private chartInstances: ECharts[] = [];
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private adminService: AdminService,
    private router: Router,
    private generalService: GeneralService ,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }


  ngOnInit() {
  if (this.isBrowser) {
     this.view = false;
    this.loadDashboard();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.urlAfterRedirects.includes('/dashboard')) {
          this.loadDashboard(); 
        }
      });
  }
}

 async loadDashboard() {
 
  if (this.isBrowser) {
     this.user = this.generalService.getUser()
     const course:any = await this.adminService.getCourseTeacher(this.user.id)
    this.adminService.getDashboardcourse(course.data[0].id).then(async(res: any) => {
      this.chartConfigs = await res.map((cfg: any) => {
        if (cfg.id === 'performance' && cfg.options.series[0].colors) {
          cfg.options.series[0].itemStyle = {
            color: (params: any) => cfg.options.series[0].colors[params.dataIndex]
          };
        }
        return cfg;
      });

     this.view = false;
setTimeout(() => {
  this.chartOptions = [...this.chartConfigs.map(cfg => cfg.options)];
  this.view = true;
});
    });


  }
}

  getChartInitOpts() {
    return this.isBrowser ? { renderer: 'svg', width: 500, height: 300 } : {};
  }

  onChartInit(ec: ECharts) {
    this.chartInstances.push(ec);
  }

  ngOnDestroy() {
    this.chartInstances.forEach(ec => ec.dispose());
    this.chartInstances = [];
  }
}
