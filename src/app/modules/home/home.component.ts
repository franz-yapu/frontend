import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Añade esta importación
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../project/services/api.service';
import { GeneralService } from '../../core/gerneral.service';
import { HomeService } from './home.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public user: any;
  public navItems: any;
  public notifications: any[] = [];
  public unreadCount: number = 0;
  public showNotifications: boolean = false;
  public currentStudent: any; // Añade esta propiedad para guardar el estudiante
  isMenuOpen = false;

  constructor(
    private generalService: GeneralService, 
    private service: ApiService,
    private homeService: HomeService,
    private router: Router // Inyecta el Router
  ) {}

  async ngOnInit() {
    this.user = this.generalService.getUser();
    await this.loadNotifications();
  }

    // Cerrar notificaciones al hacer click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const notificationsButton = target.closest('button[class*="relative"]');
    const notificationsDropdown = target.closest('.notifications-dropdown');
    
    // Si se hizo click fuera del botón y del dropdown, cerrar notificaciones
    if (!notificationsButton && !notificationsDropdown && this.showNotifications) {
      this.showNotifications = false;
      this.unreadCount = 0;
    }
  }

  async loadNotifications() {
    try {
      const userData: any = await this.homeService.getUser(this.user.id);
      const studentData: any = await this.homeService.getStudents(userData.data[0].student[0].id);
      this.currentStudent = studentData.data[0]; // Guarda el estudiante

      // Obtener las últimas 5 notificaciones
      const allNotifications = this.getFilteredNotifications(this.currentStudent);
      this.notifications = allNotifications.slice(0, 5);
      this.unreadCount = this.notifications.length;
      
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  private getFilteredNotifications(student: any): any[] {
    if (!student) return [];

    const filteredAttendances = student.attendances
      .filter((att: any) => 
        (att.status === 'late' || att.status === 'absent') && 
        att.statusSee === 'active'
      )
      .map((att: any) => ({ 
        ...att, 
        tipo: 'attendance',
        title: this.mapAttendanceStatus(att.status),
        icon: 'schedule',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        route: '/home/attendance' // Añade la ruta para asistencia
      }));

    const filteredBehaviors = student.behaviors
      .filter((beh: any) => beh.statusSee === 'active')
      .map((beh: any) => ({ 
        ...beh, 
        tipo: 'behavior',
        title: this.getBehaviorTypeLabel(beh.type),
        description: beh.description,
        icon: this.getBehaviorIcon(beh.type),
        color: this.getBehaviorColor(beh.type),
        bgColor: this.getBehaviorBgColor(beh.type),
        route: '/home/behavior' // Añade la ruta para comportamiento
      }));

    return [...filteredAttendances, ...filteredBehaviors]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private mapAttendanceStatus(status: string): string {
    switch (status) {
      case 'present': return 'Presente';
      case 'late': return 'Atraso';
      case 'absent': return 'Falta';
      case 'license': return 'Licencia';
      default: return '-';
    }
  }

  private getBehaviorTypeLabel(type: string): string {
    switch (type) {
      case '1': return 'Incidente Grave';
      case '2': return 'Aviso';
      case '3': return 'Reconocimiento';
      default: return 'Comportamiento';
    }
  }

  private getBehaviorIcon(type: string): string {
    switch (type) {
      case '1': return 'warning';
      case '2': return 'info';
      case '3': return 'military_tech';
      default: return 'psychology';
    }
  }

  private getBehaviorColor(type: string): string {
    switch (type) {
      case '1': return 'text-red-600';
      case '2': return 'text-yellow-600';
      case '3': return 'text-green-600';
      default: return 'text-gray-600';
    }
  }

  private getBehaviorBgColor(type: string): string {
    switch (type) {
      case '1': return 'bg-red-50';
      case '2': return 'bg-yellow-50';
      case '3': return 'bg-green-50';
      default: return 'bg-gray-50';
    }
  }

  toggleNotifications() {
    console.log('ss');
    
    this.showNotifications = !this.showNotifications;
    if (!this.showNotifications) {
      this.unreadCount = 0; // Marcar como leídas al cerrar
    }
  }

  // Nueva función para manejar el click en notificaciones
  onNotificationClick(notification: any) {
    console.log(notification);
    
    if (this.currentStudent) {
      // Cierra el dropdown de notificaciones
      this.showNotifications = false;
      this.unreadCount = 0;
      
      // Navega a la ruta correspondiente
      if (notification.tipo === 'behavior') {
        this.router.navigate(['/home/behavior/', this.currentStudent.id]);
      } else if (notification.tipo === 'attendance') {
        this.router.navigate(['/home/attendance/', this.currentStudent.id]);
      }
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.service.logout();
  }
}