import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { AdminService } from '../admin.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ECharts } from 'echarts';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts: () => import('echarts') }
    }
  ]
})
export class AdminDashboardComponent implements OnInit {
  isBrowser: boolean;
  chartOptions: EChartsOption[] = [];
  chartConfigs: any[] = [];
  public view =false
  private chartInstances: ECharts[] = [];
  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private adminService: AdminService,
    private router: Router
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

 loadDashboard() {
 
  if (this.isBrowser) {
    this.adminService.getDashboard().then(async(res: any) => {
      console.log(res);
      
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
