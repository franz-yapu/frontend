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
  nivel?: string;
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
        console.log('Datos del dashboard:', res);
        
        this.chartConfigs = await res.map((cfg: any) => {
          if (cfg.id === 'performance' && cfg.options.series[0].colors) {
            cfg.options.series[0].itemStyle = {
              color: (params: any) => cfg.options.series[0].colors[params.dataIndex]
            };
          }
          
          // Inicializar filtros para charts filtrables
          if (cfg.type === 'filtrable') {
            if (cfg.id === 'notas-filtradas') {
              // Para notas-filtradas: curso y profesor obligatorios
              this.selectedFilters[cfg.id] = {
                curso: '',
                materia: '',
                profesor: ''
              };
            } else {
              // Para otros charts: solo nivel
              this.selectedFilters[cfg.id] = {
                nivel: ''
              };
            }
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
    
    // Lógica específica para notas-filtradas
    if (chartId === 'notas-filtradas') {
      if (filterType === 'curso' && value !== this.selectedFilters[chartId].curso) {
        // Si cambia el curso, limpiar profesor y materia
        this.selectedFilters[chartId].profesor = '';
        this.selectedFilters[chartId].materia = '';
      }
    } 
    // Lógica para otros charts (solo nivel)
    else {
      if (filterType === 'nivel') {
        // Solo actualizar nivel para charts de nivel
        this.selectedFilters[chartId].nivel = value;
      }
    }
    
    this.selectedFilters[chartId][filterType] = value;
    
    // Aplicar filtro automáticamente
    this.applyFilter(chartId);
  }

  // Obtener materias filtradas por curso y profesor (solo para notas-filtradas)
  getFilteredMaterias(chartId: string): string[] {
    if (chartId !== 'notas-filtradas') return [];
    
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

  // Obtener profesores filtrados por curso (solo para notas-filtradas)
  getFilteredProfesores(chartId: string): string[] {
    if (chartId !== 'notas-filtradas') return [];
    
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

  // Aplicar filtros a un chart específico
  applyFilter(chartId: string) {
    const config = this.chartConfigs.find(cfg => cfg.id === chartId);
    const filters = this.selectedFilters[chartId];
    
    if (!config || !filters) return;

    // Para charts de nivel (faltas-curso, comportamiento-curso)
    if (chartId !== 'notas-filtradas') {
      this.applyLevelFilter(chartId);
    } 
    // Para notas-filtradas (requiere curso y profesor)
    else if (filters.curso && filters.profesor) {
      this.applyNotasFilter(chartId);
    }
  }

  // Aplicar filtro para charts de nivel
  applyLevelFilter(chartId: string) {
    const config = this.chartConfigs.find(cfg => cfg.id === chartId);
    const filters = this.selectedFilters[chartId];
    
    if (!config || !config.data) return;

    const filteredData = config.data.filter((item: any) => {
      // Si hay filtro de nivel, aplicar
      if (filters.nivel && item.level !== filters.nivel) {
        return false;
      }
      return true;
    });

    this.updateLevelChartWithFilteredData(chartId, filteredData);
  }

  // Aplicar filtro para notas-filtradas
  applyNotasFilter(chartId: string) {
    const config = this.chartConfigs.find(cfg => cfg.id === chartId);
    const filters = this.selectedFilters[chartId];
    
    if (!config || !filters || !filters.curso || !filters.profesor) return;

    console.log('Aplicando filtros a notas-filtradas:', filters);

    const filteredData = config.data.filter((item: any) => {
      // Curso es obligatorio
      if (filters.curso && item.curso !== filters.curso) {
        return false;
      }
      
      // Profesor es obligatorio
      if (filters.profesor && item.profesor !== filters.profesor) {
        return false;
      }
      
      // Materia es opcional
      if (filters.materia && item.materia !== filters.materia) {
        return false;
      }
      
      return true;
    });

    console.log('Datos filtrados para notas-filtradas:', filteredData);

    this.updateNotasChartWithFilteredData(chartId, filteredData);
  }

  // Actualizar chart de nivel con datos filtrados
  updateLevelChartWithFilteredData(chartId: string, filteredData: any[]) {
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
          data: filteredData.map(item => item.curso)
        },
        series: originalConfig.options.series.map((series: any) => ({
          ...series,
          data: this.getSeriesDataForLevelChart(series.name, filteredData)
        }))
      }
    };

    // Actualizar el chartOptions específico
    this.chartOptions[configIndex] = filteredConfig.options;
    
    // Forzar actualización del chart
    this.chartOptions = [...this.chartOptions];
  }

  // Obtener datos de series para charts de nivel
  getSeriesDataForLevelChart(seriesName: string, data: any[]): any[] {
    if (seriesName === 'Faltas') {
      return data.map(item => item.faltas);
    } else if (seriesName === 'Atrasos') {
      return data.map(item => item.atrasos);
    } else if (seriesName === 'Incidente Grave') {
      return data.map(item => item.incidentes);
    } else if (seriesName === 'Aviso') {
      return data.map(item => item.avisos);
    } else if (seriesName === 'Reconocimiento') {
      return data.map(item => item.reconocimientos);
    } else if (seriesName === 'Promedio') {
      return data.map(item => item.promedio);
    }
    return [];
  }

  // Actualizar chart de notas con datos filtrados
  updateNotasChartWithFilteredData(chartId: string, filteredData: any[]) {
    const configIndex = this.chartConfigs.findIndex(cfg => cfg.id === chartId);
    if (configIndex === -1) return;

    const originalConfig = this.chartConfigs[configIndex];
    
    // Si no hay datos filtrados, mostrar chart vacío
    if (filteredData.length === 0) {
      const emptyConfig = {
        ...originalConfig,
        options: {
          ...originalConfig.options,
          xAxis: {
            ...originalConfig.options.xAxis,
            data: []
          },
          series: originalConfig.options.series.map((series: any) => ({
            ...series,
            data: []
          }))
        }
      };

      this.chartOptions[configIndex] = emptyConfig.options;
    } else {
      // Crear nueva configuración con datos filtrados
      const filteredConfig = {
        ...originalConfig,
        options: {
          ...originalConfig.options,
          xAxis: {
            ...originalConfig.options.xAxis,
            data: filteredData.map(item => `${item.curso}\n${item.materia}`)
          },
          series: originalConfig.options.series.map((series: any) => ({
            ...series,
            data: filteredData.map(item => {
              if (series.name === 'Promedio General') {
                return item.promedioGeneral;
              }
              return 0;
            })
          }))
        }
      };

      this.chartOptions[configIndex] = filteredConfig.options;
    }
    
    // Forzar actualización del chart
    this.chartOptions = [...this.chartOptions];
  }

  // Limpiar filtros
  clearFilters(chartId: string) {
    if (this.selectedFilters[chartId]) {
      if (chartId === 'notas-filtradas') {
        this.selectedFilters[chartId] = {
          curso: '',
          materia: '',
          profesor: ''
        };
      } else {
        this.selectedFilters[chartId] = {
          nivel: ''
        };
      }
      
      // Recargar chart original
      this.applyFilter(chartId);
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