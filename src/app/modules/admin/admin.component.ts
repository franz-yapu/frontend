import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GeneralService } from '../../core/gerneral.service';
import { ApiService } from '../../project/services/api.service';
import { NavbarComponent } from '../../project/components/navbar/navbar.component';
import { NavbarAdminComponent } from '../../project/components/navbar-admin/navbar-admin.component';
import { AdminService } from './admin.service';


@Component({
  selector: 'app-admin',
  imports: [ CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  public user: any
  public navItems: any
  isMenuOpen = false;
  public users: any


  constructor(private generalService: GeneralService ,private service: ApiService, private adminService: AdminService) {

  }
  ngOnInit(): void {
    this.user = this.generalService.getUser()
    if (this.user?.role?.name == "TEACHER") {
      this.adminService.getCourseTeacher(this.user.id).then((res: any) => {
        console.log(res);
        
        if (res.data.length > 0) {
          this.navItems = [
            {
              path: 'dashboard-teacher',
              title: 'dashboard',
              activeClass: 'border-indigo-500 text-gray-900',
              inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            },
            {
              path: 'list-attendance/'+res.data[0].id,
              title: 'Asistencia',
              activeClass: 'border-indigo-500 text-gray-900',
              inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            },
            {
              path: 'behavior/'+res.data[0].id,
              title: 'Comportamiento',
              activeClass: 'border-indigo-500 text-gray-900',
              inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            },
            {
              path: 'record/'+res.data[0].id,
              title: 'Notas',
              activeClass: 'border-indigo-500 text-gray-900',
              inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            },
            {
              path: 'about',
              title: 'Acerca del colegio ',
              activeClass: 'border-indigo-500 text-gray-900',
              inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            },
          ];
        }else {
      this.navItems = [
        {
          path: 'dashboard',
          title: 'dashboard',
          activeClass: 'border-indigo-500 text-gray-900',
          inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        },
        {
          path: 'attendance',
          title: 'Asistencia',
          activeClass: 'border-indigo-500 text-gray-900',
          inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        },
        {
          path: 'behavior',
          title: 'Comportamiento',
          activeClass: 'border-indigo-500 text-gray-900',
          inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        },
        {
          path: 'record',
          title: 'Notas',
          activeClass: 'border-indigo-500 text-gray-900',
          inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        },
         {
              path: 'about',
              title: 'Acerca del colegio ',
              activeClass: 'border-indigo-500 text-gray-900',
              inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            },


      ];

    }


      })

    }

    if (this.user?.role?.name == "ADMIN") {
      this.navItems = [

        {
          path: 'dashboard',
          title: 'dashboard',
          activeClass: 'border-indigo-500 text-gray-900',
          inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        },
        {
          path: 'courses',
          title: 'Cursos',
          activeClass: 'border-indigo-500 text-gray-900',
          inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        },
        {
          path: 'attendance',
          title: 'Asistencia',
          activeClass: 'border-indigo-500 text-gray-900',
          inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        },
        {
          path: 'behavior',
          title: 'Comportamiento',
          activeClass: 'border-indigo-500 text-gray-900',
          inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        },
        {
          path: 'record',
          title: 'Notas',
          activeClass: 'border-indigo-500 text-gray-900',
          inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        },

        
        {
          path: '/admin/teacher',
          title: 'Usuarios',
          activeClass: 'border-indigo-500 text-gray-900',
          inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        },
  {
              path: 'about',
              title: 'Acerca del colegio ',
              activeClass: 'border-indigo-500 text-gray-900',
              inactiveClass: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            },

      ];
    } 
  }



  logout() {
    this.service.logout();
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
