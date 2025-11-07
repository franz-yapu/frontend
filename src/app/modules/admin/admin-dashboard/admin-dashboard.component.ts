import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NGX_ECHARTS_CONFIG, NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { AdminService } from '../admin.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ECharts } from 'echarts';
import { FormsModule } from '@angular/forms';

interface FilterState {
  curso?: string;
  materia?: string;
  profesor?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, NgxEchartsModule, FormsModule],
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
  public view = false;
  private chartInstances: ECharts[] = [];
  
  // Estado de filtros
  selectedFilters: { [chartId: string]: FilterState } = {};

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
          
          // Inicializar filtros para charts filtrables
          if (cfg.type === 'filtrable') {
            this.selectedFilters[cfg.id] = {
              curso: '', // Inicialmente vacío para forzar selección
              materia: '',
              profesor: '' // Inicialmente vacío para forzar selección
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

  // Métodos auxiliares para manejar filtros de forma segura
  getFilterValue(chartId: string, filterType: keyof FilterState): string {
    return this.selectedFilters[chartId]?.[filterType] || '';
  }

  setFilterValue(chartId: string, filterType: keyof FilterState, value: string): void {
    if (!this.selectedFilters[chartId]) {
      this.selectedFilters[chartId] = {};
    }
    
    // Si se cambia el curso, limpiar profesor y materia
    if (filterType === 'curso' && value !== this.selectedFilters[chartId].curso) {
      this.selectedFilters[chartId].profesor = '';
      this.selectedFilters[chartId].materia = '';
    }
    
    this.selectedFilters[chartId][filterType] = value;
    
    // Solo aplicar filtro si ambos campos obligatorios están llenos
    if (this.getFilterValue(chartId, 'curso') && this.getFilterValue(chartId, 'profesor')) {
      this.applyFilter(chartId);
    }
  }

  // Obtener materias filtradas por curso y profesor
  getFilteredMaterias(chartId: string): string[] {
    const config = this.chartConfigs.find(cfg => cfg.id === chartId);
    if (!config || !config.data) return [];
    
    const curso = this.getFilterValue(chartId, 'curso');
    const profesor = this.getFilterValue(chartId, 'profesor');
    
    if (!curso) return config.filters.materias || [];
    
    const materiasUnicas = new Set<string>();
    
    config.data.forEach((item: any) => {
      if (item.curso === curso && (!profesor || item.profesor === profesor)) {
        materiasUnicas.add(item.materia);
      }
    });
    
    return Array.from(materiasUnicas).sort();
  }

  // Obtener profesores filtrados por curso
  getFilteredProfesores(chartId: string): string[] {
    const config = this.chartConfigs.find(cfg => cfg.id === chartId);
    if (!config || !config.data) return [];
    
    const curso = this.getFilterValue(chartId, 'curso');
    if (!curso) return config.filters.profesores || [];
    
    const profesoresUnicos = new Set<string>();
    
    config.data.forEach((item: any) => {
      if (item.curso === curso) {
        profesoresUnicos.add(item.profesor);
      }
    });
    
    return Array.from(profesoresUnicos).sort();
  }

  // Aplicar filtros a un chart específico (solo si hay curso y profesor seleccionado)
  applyFilter(chartId: string) {
    const config = this.chartConfigs.find(cfg => cfg.id === chartId);
    const filters = this.selectedFilters[chartId];
    
    if (!config || !filters || !filters.curso || !filters.profesor) return;

    // Filtrar los datos según los filtros seleccionados
    const filteredData = config.data.filter((item: any) => {
      let match = true;
      
      // Curso es obligatorio, siempre debe coincidir
      if (filters.curso && item.curso !== filters.curso) {
        match = false;
      }
      
      // Profesor es obligatorio, siempre debe coincidir
      if (filters.profesor && item.profesor !== filters.profesor) {
        match = false;
      }
      
      // Materia es opcional
      if (filters.materia && item.materia !== filters.materia) {
        match = false;
      }
      
      return match;
    });

    // Actualizar el chart con los datos filtrados
    this.updateChartWithFilteredData(chartId, filteredData);
  }

  // Actualizar el chart con datos filtrados
  updateChartWithFilteredData(chartId: string, filteredData: any[]) {
    const configIndex = this.chartConfigs.findIndex(cfg => cfg.id === chartId);
    if (configIndex === -1) return;

    const originalConfig = this.chartConfigs[configIndex];
    
    // Crear nueva configuración con datos filtrados
    const filteredConfig = {
      ...originalConfig,
      options: {
        ...originalConfig.options,
        xAxis: {
          ...originalConfig.options.xAxis,
          data: filteredData.map(item => `${item.materia}`) // Solo materia ahora
        },
        series: originalConfig.options.series.map((series: any, index: number) => ({
          ...series,
          data: filteredData.map(item => {
            if (series.name === 'Promedio General') {
              return item.promedioGeneral;
            } else if (series.name === 'Promedio por Estudiante') {
              return item.promedioEstudiantes;
            }
            return 0;
          })
        }))
      }
    };

    // Actualizar el chartOptions específico
    this.chartOptions[configIndex] = filteredConfig.options;
    
    // Forzar actualización del chart
    this.chartOptions = [...this.chartOptions];
  }

  // Limpiar filtros
  clearFilters(chartId: string) {
    if (this.selectedFilters[chartId]) {
      this.selectedFilters[chartId] = {
        curso: '',
        materia: '',
        profesor: ''
      };
    }
  }

  // Verificar si un chart tiene todos los filtros obligatorios seleccionados
  hasRequiredFilters(chartId: string): boolean {
    return !!this.getFilterValue(chartId, 'curso') && !!this.getFilterValue(chartId, 'profesor');
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